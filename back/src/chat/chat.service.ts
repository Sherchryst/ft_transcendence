import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { getRepository, IsNull, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ChannelMember, ChannelMemberRole } from './entities/channel-member.entity';
import { ChannelMessage } from './entities/channel-message.entity';
import { ChannelModeration, ChannelModerationType } from './entities/channel-moderation.entity';
import { Channel, ChannelVisibility } from './entities/channel.entity';
import { DirectMessage } from './entities/direct-message.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  async createChannel(name: string, owner: User): Promise<Channel> {
    return getRepository(Channel).save({
      name: name,
      owner: owner
    });
  }

  async createMessage(from: User, content: string): Promise<Message> {
    const msg = getRepository(Message).create({
      from: from,
      content: content
    });
    await getRepository(Message).save(msg);
    return msg;
  }

  async findChannel(channelId: number): Promise<Channel> {
    return getRepository(Channel).findOne({
      where: { id: channelId }
    });
  }

  async getChannelMembers(channelId: number): Promise<User[]> {
    return getRepository(ChannelMember).find({
      where: { channel: { id: channelId } }
    }).then(members => members.map(m => m.user));
  }

  async getChannelMessages(channelId: number): Promise<Message[]> {
    return getRepository(ChannelMessage).find({
      where: { channel: { id: channelId } }
    }).then(messages => messages.map(m => m.message));
  }

  async isBan(user: User, channelId: number): Promise<boolean> {
    return getRepository(ChannelModeration).findOne({
      where: {
        channel: { id: channelId },
        user: user,
        type: ChannelModerationType.BAN,
        expire_at: [ IsNull(), MoreThanOrEqual(new Date())  ],
        pardon_at: IsNull()
      }
    }).then(ban => !!ban);
  }

  async isMute(user: User, channelId: number): Promise<boolean> {
    return getRepository(ChannelModeration).findOne({
      where: {
        channel: { id: channelId },
        user: user,
        type: ChannelModerationType.MUTE,
        expire_at: MoreThanOrEqual(new Date()),
        pardon_at: IsNull()
      }
    }).then(mute => !!mute);
  }

  async joinChannel(user: User, channelId: number, role: ChannelMemberRole): Promise<ChannelMember> {
    return getRepository(ChannelMember).save({
      channel: { id: channelId },
      user: user,
      role: role
    });
  }

  async leaveChannel(user: User, channelId: number): Promise<void> {
    await getRepository(ChannelMember).delete({
      channel: { id: channelId },
      user: user
    });
  };

  async listChannels(): Promise<Channel[]> {
    return getRepository(Channel).find({
      where: { visibility: ChannelVisibility.PUBLIC }
    });
  }

  async sendChannelMessage(channelId: number, message: Message): Promise<ChannelMessage> {
    const msg = getRepository(ChannelMessage).create({
      channel: { id: channelId },
      message: message
    });
    await getRepository(ChannelMessage).save(msg);
    return msg;
  }

  async sendDirectMessage(to: User, message: Message): Promise<DirectMessage> {
    const msg = getRepository(DirectMessage).create({
      to: to,
      message: message
    });
    await getRepository(DirectMessage).save(msg);
    return msg;
  }
}
