import { Body, Controller, Get, Post, Req, UseGuards, UnauthorizedException, HttpException, ForbiddenException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Jwt2faGuard } from 'src/auth/jwt/jwt.guard';
import { UsersService } from 'src/users/users.service';
import { ChannelMemberRole } from './entities/channel-member.entity';
import { ChatGateway } from './chat.gateway';
import { ChannelVisibility } from './entities/channel.entity';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Controller('chat')
@UseGuards(Jwt2faGuard)
export class ChatController {
  constructor(
    private chatService: ChatService,
    private userService: UsersService,
    private chatGateway: ChatGateway
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
  async join(@Req() req, @Body() dto: {channelId: number, password: string}) {
    try {
      this.chatGateway.join(req, this.chatGateway.wsClients.get(req.user.id), dto)
    }
    catch (error) {
      throw new HttpException(error, 403);
    }
  }

  @Post('create')
  async create(@Req() req, @Body() data: {name: string, password: string, visibility: ChannelVisibility}) {
    try {
      this.chatGateway.create(req, this.chatGateway.wsClients.get(req.user.id), data)
    } catch (error) {
        throw new HttpException(error, 403);
    }
  }
}
