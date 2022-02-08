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

@Module({
  imports: [TypeOrmModule.forFeature([
    Channel,
    ChannelInvitation,
    ChannelMember,
    ChannelModeration,
    ChannelMessage,
    DirectMessage,
    Message
  ])],
  controllers: [ChatController]
})
export class ChatModule {}
