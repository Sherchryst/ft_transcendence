import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Jwt2faGuard } from 'src/auth/jwt/jwt.guard';
import { UsersService } from 'src/users/users.service';

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
}
