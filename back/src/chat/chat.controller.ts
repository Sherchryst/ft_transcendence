import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Jwt2faGuard } from 'src/auth/jwt/jwt.guard';

@Controller('chat')
@UseGuards(Jwt2faGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('list')
    async list() {
      const stuff = JSON.stringify(await this.chatService.listChannels());
      return stuff
    }
}
