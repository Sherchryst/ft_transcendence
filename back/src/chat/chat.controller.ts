import { Controller, Get, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Jwt2faGuard } from 'src/auth/jwt/jwt.guard';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(Jwt2faGuard)
  @Get('list')
    async list() {
      const stuff = JSON.stringify(await this.chatService.listChannels());
      return stuff
    }
}
