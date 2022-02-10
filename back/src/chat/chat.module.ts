import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { ChannelInvitation } from './entities/channel-invitation.entity';
import { ChannelMember } from './entities/channel-member.entity';
import { ChannelModeration } from './entities/channel-moderation.entity';
import { ChannelMessage } from './entities/channel-message.entity';
import { DirectMessage } from './entities/direct-message.entity';
import { Message } from './entities/message.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ChatController],
  imports: [TypeOrmModule.forFeature([
    Channel,
    ChannelInvitation,
    ChannelMember,
    ChannelModeration,
    ChannelMessage,
    DirectMessage,
    Message
  ]),
  AuthModule,
  UsersModule],
  providers: [ChatService, ChatGateway]
})
export class ChatModule {}
