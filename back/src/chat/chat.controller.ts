import { ClassSerializerInterceptor, Controller, Get, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Jwt2faGuard } from 'src/auth/jwt/jwt.guard';

@Controller('chat')
@UseGuards(Jwt2faGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('list')
    async list() {
      return await this.chatService.listChannels();
    }
}
