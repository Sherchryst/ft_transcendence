import { ClassSerializerInterceptor, Body, Controller, Get, Post, Req, UseGuards, UnauthorizedException, ForbiddenException, NotFoundException, Query, UseInterceptors, ConflictException, BadRequestException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Jwt2faGuard } from 'src/auth/jwt/jwt.guard';
import { UsersService } from 'src/users/users.service';
import { ChannelMemberRole } from './entities/channel-member.entity';
import { ChatGateway } from './chat.gateway';
import { ChannelVisibility } from './entities/channel.entity';
import { ChannelModerationType } from './entities/channel-moderation.entity';

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
    const channels = JSON.stringify(await this.userService.getAllChannelsConnected(user.id))
    return channels
  }

  @Post('join')
  async join(@Req() req, @Body() data: {channelId: number, password: string}) {
      const client = await this.chatGateway.wsClients.get(req.user.id);
      let channel = await this.chatService.findChannel(data.channelId);
      if (!channel) {
          console.log("channel", data, data.channelId)
          throw new NotFoundException("No such channel");
      }
      if (await this.chatService.getChannelMember(channel.id, req.user.id))
        return ;
      if (channel.password && channel.password !== data.password && !await this.chatService.isInvited(data.channelId, req.user))
          throw new UnauthorizedException("Wrong Password");
      await this.chatService.joinChannel(req.user, data.channelId, ChannelMemberRole.MEMBER);
      client.join("channel:" + channel.id);
      this.chatGateway.server.in("channel:" + channel.id).emit("joined", req.user)
  }

  @Post('create')
  async create(@Req() req, @Body() data: {name: string, password: string, visibility: ChannelVisibility}) {
    const client = await this.chatGateway.wsClients.get(req.user.id);
    let channel;
    try {
      channel = await this.chatService.createChannel(data.name, req.user, data.password, data.visibility);
    } catch (error) {
      throw new ConflictException("channel already exists");
    }
    await this.chatService.joinChannel(req.user, channel.id, ChannelMemberRole.ADMIN);
    this.chatGateway.server.emit("created", { channel: channel})
    client.join("channel:" + channel.id);
    return JSON.stringify(channel);
  }

  @Post('leave')
  async leave(@Req() req, @Body() data: {channelId: number}) {
    const client = await this.chatGateway.wsClients.get(req.user.id);
    await this.chatService.leaveChannel(req.user, data.channelId);
    const members = await this.chatService.getChannelMembers(data.channelId);
    if (members.length == 0)
      await this.chatService.deleteChannel(data.channelId);
    this.chatGateway.server.in("channel:" + data.channelId).emit("left", req.user.id);
    client.leave("channel:" + data.channelId);
  }

  @Get('channel-info')
  async channel_info(@Req() req, @Query('channelId') channelId: number) {
    console.log(channelId);
    const channel = await this.chatService.findChannel(channelId);
    if (!channel)
      throw new ForbiddenException("No such channel");
    const member = await this.chatService.getChannelMember(channelId, req.user.id);
    if (!member)
      throw new UnauthorizedException("you're not a channel member");
    const history = await this.chatService.getChannelMessages(channelId, new Date(), 100);
    const members = await this.chatService.getChannelMembers(channelId);
    return JSON.stringify({'channel': channel, 'history': history, 'members': members});
  }

  @Post('invite')
  async invite(@Req() req, @Body() data: {channelId: number, invitedNick: string}) {
    const sender = await this.chatService.getChannelMember(data.channelId, req.user.id);
    if (!sender)
        throw new UnauthorizedException("you're not a channel member");
    const invited = await this.userService.findByNick(data.invitedNick);
    if (!invited)
      throw new NotFoundException("No such Nick");
    const invitation = await this.chatService.createInvitation(data.channelId, req.user, invited.id);
    invitation.channel = await this.chatService.findChannel(invitation.channel.id);
    if (!invitation)
      throw new NotFoundException("target doesn't exist");
    console.log("Channel Invitation", invitation)
    this.chatGateway.wsClients.get(invited.id).emit("invited", invitation);
  }

  @Post('delete-invitation')
  async delete_invitation(@Body() data: {channelId: number, fromId: number, toId: number}) {
    this.chatService.deleteInvitation(data.channelId, data.fromId, data.toId);
  }

  @Get('invite-list')
  async invite_list(@Req() req) {
    return await this.chatService.getInvitations(req.user.id);
  }

  @Post('moderation')
  async moderation(@Req() req, @Body() data: {channelId: number, toId: number, reason: string, duration: number, moderation: ChannelModerationType}) {
    const member = await this.chatService.getChannelMember(data.channelId, req.user.id);
    if (!member || member.role != ChannelMemberRole.ADMIN)
      throw new UnauthorizedException("you're not an admin");
    if (data.duration <= 0)
      throw new BadRequestException("Wrong durartion");
    await this.chatService.createChannelModeration(data.channelId, data.toId, req.user, data.moderation, data.reason, data.duration);
    this.chatGateway.server.to("channel:" + data.channelId).emit(data.moderation, member);
  }

  @Post('promote')
  async promote(@Req() req, @Body() data: {channelId: number, targetId: number}) {
    const channel = await this.chatService.findChannel(data.channelId);
    if (!channel || channel.owner.id != req.user.id)
      throw new UnauthorizedException("you're not the owner");
    let member = await this.chatService.getChannelMember(data.channelId, data.targetId);
    member.role = ChannelMemberRole.ADMIN;
    this.chatService.updateMember(member);
    this.chatGateway.server.to("channel:" + data.channelId).emit("promote", member);
  }
}
