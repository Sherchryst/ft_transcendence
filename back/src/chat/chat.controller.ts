import { Body, Controller, Get, Post, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Jwt2faGuard } from 'src/auth/jwt/jwt.guard';
import { UsersService } from 'src/users/users.service';
import { ChannelMemberRole } from './entities/channel-member.entity';

@Controller('chat')
@UseGuards(Jwt2faGuard)
export class ChatController {
  constructor(
    private chatService: ChatService,
    private userService: UsersService
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

  //same as chatGateway.join
  @Post('join')
  async join(@Req() req, @Body() dto: {channelID: number, password: string}) : Promise<string> {
    let channel = await this.chatService.findChannel(dto.channelID);
    if (channel.password && channel.password !== dto.password)
      throw new UnauthorizedException('Invalid password');
    this.chatService.joinChannel(req.user, dto.channelID, ChannelMemberRole.MEMBER);
    return 'join channel !'
  }
}
