import { ClassSerializerInterceptor, Body, Controller, Get, Post, Req, UseGuards, UnauthorizedException, ForbiddenException, NotFoundException, Query, UseInterceptors, ConflictException, BadRequestException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Jwt2faGuard } from 'src/auth/jwt/jwt.guard';
import { UsersService } from 'src/users/users.service';
import { ChannelMemberRole } from './entities/channel-member.entity';
import { ChatGateway } from './chat.gateway';
import { ChannelModerationType } from './entities/channel-moderation.entity';
import { instanceToPlain } from 'class-transformer';
import { CreateChannelDto } from './dto/create.dto';
import * as sha from 'sha.js';

@Controller('chat')
@UseGuards(Jwt2faGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ChatController {
  constructor(
    private chatService: ChatService,
    private userService: UsersService,
    private chatGateway: ChatGateway,
  ) {}

  @Get('list')
    async list() {
      return await this.chatService.listChannels();
    }

  @Get('join-list')
  async joinList(@Req() req) {
    const user = req.user
    return await this.userService.getAllChannelsConnected(user.id);
  }

  @Get('direct-messages')
  async directMessage(@Req() req, @Query('to') to: number) {
    const user = req.user
    const messages = JSON.stringify(await this.chatService.getDirectMessage(user.id, to))
    return messages
  }

  @Post('join')
  async join(@Req() req, @Body() data: {channelId: number, password: string}) {
      if (data.channelId == undefined)
        throw new BadRequestException();
      const client = await this.chatGateway.wsClients.get(req.user.id);
      let channel = await this.chatService.findChannel(data.channelId);
      if (!channel) {
          throw new NotFoundException("No such channel");
      }
      if (await this.chatService.isBanned(req.user, data.channelId))
        throw new UnauthorizedException("You're banned!");
      if (await this.chatService.getChannelMember(channel.id, req.user.id))
        return ;
      if (!channel.doesPasswordMatch(data.password)
      && !await this.chatService.isInvited(data.channelId, req.user))
        throw new UnauthorizedException("Wrong Password");
      await this.chatService.joinChannel(req.user, data.channelId, ChannelMemberRole.MEMBER);
      client.join("channel:" + channel.id);
      this.chatGateway.server.in("channel:" + channel.id).emit("joined", instanceToPlain(req.user));
      this.chatGateway.handleMsg(req, client, {chanId: channel.id, msg: "Hello"});
  }

  @Post('create')
  async create(@Req() req, @Body() data: CreateChannelDto) {
    const client = await this.chatGateway.wsClients.get(req.user.id);
    let channel;
    try {
      channel = await this.chatService.createChannel(data.name, req.user, data.password, data.visibility);
    } catch (error) {
      throw new ConflictException("Channel already exists");
    }
    await this.chatService.joinChannel(req.user, channel.id, ChannelMemberRole.ADMIN);
    this.chatGateway.server.emit("created", { channel: instanceToPlain(channel)})
    client.join("channel:" + channel.id);
    return JSON.stringify(instanceToPlain(channel));
  }

  @Post('leave')
  async leave(@Req() req, @Body() data: {channelId: number}) {
    if (data.channelId == undefined)
      throw new BadRequestException();
    const client = await this.chatGateway.wsClients.get(req.user.id);
    const members = await this.chatService.getChannelMembers(data.channelId);
    const channel = await this.chatService.findChannel(data.channelId);
    if (! await this.chatService.getChannelMember(data.channelId, req.user.id))
      throw new UnauthorizedException("You're not a channel member");
    if (members.length == 1 || channel.owner.id == req.user.id) {
      await this.chatService.deleteChannel(data.channelId);
      this.chatGateway.server.in("channel:" + data.channelId).socketsLeave("channel:" + data.channelId);
    }
    else {
      this.chatGateway.server.in("channel:" + data.channelId).emit("left", req.user.id);
      await this.chatGateway.handleMsg(req, client, {chanId: channel.id, msg: "Bye"});
      client.leave("channel:" + data.channelId);
      await this.chatService.leaveChannel(req.user, data.channelId);
    }
  }

  @Get('channel-info')
  async channel_info(@Req() req, @Query('channelId') channelId: number) {
    if (!channelId)
      throw new BadRequestException();
    const channel = await this.chatService.findChannel(channelId);
    if (!channel)
      throw new ForbiddenException("No such channel");
    const member = await this.chatService.getChannelMember(channelId, req.user.id);
    if (!member)
      throw new UnauthorizedException("you're not a channel member");
    const history = await this.chatService.getChannelMessages(channelId, new Date(), 100);
    const members = await this.chatService.getChannelMembers(channelId);
    const block_list = await this.userService.getBlockedUsers(req.user.id);
    let filtered_history = [];
    for (let i = 0; i != history.length; ++i) {
      if (!block_list.find((user) => {return user.id == history[i].from.id}))
        filtered_history.push(history[i])
    }
    return JSON.stringify({'channel': instanceToPlain(channel), 'history': instanceToPlain(filtered_history), 'members': instanceToPlain(members)});
  }

  @Post('invite')
  async invite(@Req() req, @Body() data: {channelId: number, invitedNick: string}) {
    if (data.channelId == undefined || data.invitedNick == undefined)
      throw new BadRequestException('undefined parameters')
    const sender = await this.chatService.getChannelMember(data.channelId, req.user.id);
    if (!sender)
        throw new UnauthorizedException("you're not a channel member");
    const invited = await this.userService.findByNick(data.invitedNick);
    if (!invited)
      throw new NotFoundException("No such Nick");
    if (await this.chatService.getChannelMember(data.channelId, invited.id))
      throw new ConflictException("already a channel member");
    const invitation = await this.chatService.createInvitation(data.channelId, req.user, invited.id);
    invitation.channel = await this.chatService.findChannel(invitation.channel.id);
    if (!invitation)
      throw new NotFoundException("target doesn't exist");
    try {
      this.chatGateway.wsClients.get(invited.id).emit("invited", instanceToPlain(invitation));
    } catch (error) {}
  }

  @Post('delete-invitation')
  async delete_invitation(@Body() data: {channelId: number, fromId: number, toId: number}) {
    if (data.channelId == undefined || data.fromId == undefined || data.toId == undefined)
      throw new BadRequestException()
    this.chatService.deleteInvitation(data.channelId, data.fromId, data.toId);
  }

  @Get('invite-list')
  async invite_list(@Req() req) {
    return await this.chatService.getInvitations(req.user.id);
  }

  @Post('moderation')
  async moderation(@Req() req, @Body() data: {channelId: number, toId: number, reason: string, duration: number, moderation: ChannelModerationType}) {
    if (data.channelId == undefined || data.toId == undefined)
      throw new BadRequestException()
    const member = await this.chatService.getChannelMember(data.channelId, req.user.id);
    const target = await this.chatService.getChannelMember(data.channelId, data.toId);
    if (!member || member.role != ChannelMemberRole.ADMIN)
      throw new UnauthorizedException("you're not an admin");
    if (!target || target.role == ChannelMemberRole.ADMIN)
      throw new UnauthorizedException("you can't target this user");
    if (data.duration <= 0 || data.duration > 31536000000)
      throw new BadRequestException("Wrong duration");
    await this.chatService.createChannelModeration(data.channelId, data.toId, req.user, data.moderation, data.reason, data.duration);
    await this.chatGateway.handleMsg(req, this.chatGateway.wsClients.get(req.user.id), {chanId: data.channelId, msg: data.moderation + " " + target.user.nickname + " because : " + data.reason})
    if (data.moderation == "ban") {
      req.user = target.user;
      this.leave(req, {channelId: data.channelId})
    }
  }

  @Post('promote')
  async promote(@Req() req, @Body() data: {channelId: number, targetId: number}) {
    if (data.channelId == undefined || data.targetId == undefined)
      throw new BadRequestException("undefined parameters");
    const channel = await this.chatService.findChannel(data.channelId);
    if (!channel || channel.owner.id != req.user.id)
      throw new UnauthorizedException("you're not the owner");
    const member = await this.chatService.getChannelMember(channel.id, data.targetId)
    if (!member)
      throw new UnauthorizedException("target doesn't exist");
    if (member.role == ChannelMemberRole.ADMIN)
      throw new UnauthorizedException("already an administrator")
    this.chatService.updateMemberRole(channel.id, data.targetId, ChannelMemberRole.ADMIN);
    this.chatGateway.handleMsg(req, this.chatGateway.wsClients.get(req.user.id), {chanId: data.channelId, msg: member.user.nickname + " is now an administrator"})
  }

  @Post('demote')
  async demote(@Req() req, @Body() data: {channelId: number, targetId: number}) {
    if (data.channelId == undefined || data.targetId == undefined)
      throw new BadRequestException("undefined parameters");
    const channel = await this.chatService.findChannel(data.channelId);
    if (!channel || channel.owner.id != req.user.id)
      throw new UnauthorizedException("you're not the owner");
    const member = await this.chatService.getChannelMember(channel.id, data.targetId)
    if (!member)
      throw new UnauthorizedException("target doesn't exist");
    if (member.role == ChannelMemberRole.MEMBER)
      throw new UnauthorizedException("Not an administrator");
    this.chatService.updateMemberRole(channel.id, data.targetId, ChannelMemberRole.MEMBER);
    this.chatGateway.handleMsg(req, this.chatGateway.wsClients.get(req.user.id), {chanId: data.channelId, msg: member.user.nickname + " is no longer an administrator"})
  }

  @Post('set-password')
  async setPassword(@Req() req, @Body() data: {channelId: number, password: string}) {
    //console.log(data)
    if (data.channelId == undefined || data.password == undefined)
      throw new BadRequestException('undefined parameters')
    const channel = await this.chatService.findChannel(data.channelId);
    if (!channel || channel.owner.id != req.user.id)
      throw new UnauthorizedException("you're not the owner");
    channel.password = data.password.length ? sha('sha256').update(data.password).digest('hex') : null;
    channel.isPasswordSet = channel.password != null;
    this.chatService.updateChannel(channel);
    await this.chatGateway.handleMsg(req, this.chatGateway.wsClients.get(req.user.id), {chanId: data.channelId, msg: "The new password is : " + data.password})
    return 'ok';
  }
}
