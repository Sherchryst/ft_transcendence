import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { getRepository } from 'typeorm';
import { ChannelMember, ChannelMemberRole } from './entities/channel-member.entity';
import { ChannelMessage } from './entities/channel-message.entity';
import { Channel, ChannelVisibility } from './entities/channel.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  async createChannel(name: string, owner: User): Promise<Channel> {
    return getRepository(Channel).save({
      name: name,
      owner: owner
    });
  }

  async findChannel(channelId: number): Promise<Channel> {
    return getRepository(Channel).findOne({
      where: { id: channelId }
    });
  }

  async getChannelMessages(channelId: number): Promise<Message[]> {
    return getRepository(ChannelMessage).find({
      where: { channel: { id: channelId } }
    }).then(messages => messages.map(m => m.message));
  }

  async listChannels(): Promise<Channel[]> {
    return getRepository(Channel).find({
      where: { visibility: ChannelVisibility.PUBLIC }
    });
  }

  async joinChannel(user: User, channelId: number, role: ChannelMemberRole): Promise<ChannelMember> {
    return getRepository(ChannelMember).save({
      channel: { id: channelId },
      user: user,
      role: role
    });
  }
}
