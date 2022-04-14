import { Body, Controller, Get, Post, Req, UseGuards, UnauthorizedException, HttpException, ForbiddenException, NotFoundException, Query, UseFilters, ConflictException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Jwt2faGuard } from 'src/auth/jwt/jwt.guard';
import { UsersService } from 'src/users/users.service';
import { ChannelMemberRole } from './entities/channel-member.entity';
import { ChatGateway } from './chat.gateway';
import { ChannelVisibility } from './entities/channel.entity';

@Controller('chat')
@UseGuards(Jwt2faGuard)
export class ChatController {
  constructor(
    private chatService: ChatService,
    private userService: UsersService,
    private chatGateway: ChatGateway,
  ) {}

  @Get('list')
    async list() {
      const stuff = JSON.stringify(await this.chatService.listChannels());
      return stuff
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
      if (await this.chatService.getChannelMember(channel.id, req.user.id))
          return
      if (!channel) {
          console.log("channel", data.channelId)
          throw new NotFoundException("No such channel");
      }
      if (channel.password && channel.password !== data.password && !await this.chatService.isInvited(data.channelId, req.user))
          throw new UnauthorizedException("Wrong Password");
      this.chatService.joinChannel(req.user, data.channelId, ChannelMemberRole.MEMBER);
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
      this.chatService.deleteChannel(data.channelId);
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
    const sender = this.chatService.getChannelMember(data.channelId, req.user.id);
    if (!sender)
        throw new UnauthorizedException("you're not a channel member");
    const invited = await this.userService.findByNick(data.invitedNick);
    if (!invited)
      throw new NotFoundException("No such Nick");
    const invitation = this.chatService.createInvitation(data.channelId, req.user, invited.id);
    if (!invitation)
      throw new NotFoundException("target doesn't exist");
    this.chatGateway.wsClients.get(invited.id).send(invitation);
  }

}
