import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { getRepository, IsNull, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ChannelInvitation } from './entities/channel-invitation.entity';
import { ChannelMember, ChannelMemberRole } from './entities/channel-member.entity';
import { ChannelMessage } from './entities/channel-message.entity';
import { ChannelModeration, ChannelModerationType } from './entities/channel-moderation.entity';
import { Channel, ChannelVisibility } from './entities/channel.entity';
import { DirectMessage } from './entities/direct-message.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  async createChannel(name: string, owner: User, password: string, visibility: ChannelVisibility): Promise<Channel> {
    const channel = getRepository(Channel).create({
      name: name,
      owner: owner,
      visibility: visibility,
      password: password,
      isPasswordSet: password != undefined && password.length != 0
    });
    await getRepository(Channel).save(channel);
    return channel;
  }

  async createInvitation(channelId: number, from: User, toUserId: number): Promise<ChannelInvitation> {
    const invitation = getRepository(ChannelInvitation).create({
      channel: { id: channelId },
      from: from,
      to: { id: toUserId },
      sent_at: new Date()
    });
    await getRepository(ChannelInvitation).save(invitation);
    return invitation;
  }

  async deleteInvitation(channelId: number, fromId: number, toId: number) {
    await getRepository(ChannelInvitation).delete({
      channel: {id: channelId}, 
      to: {id: toId},
      from: {id: fromId}
    });
  }

  async getInvitations(userId: number): Promise<ChannelInvitation[]> {
    return await getRepository(ChannelInvitation).find({
      relations: ['channel', 'to', 'from'],
      where: { to: { id: userId } }
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

  async createChannelMessage(channelId: number, message: Message): Promise<ChannelMessage> {
    const msg = getRepository(ChannelMessage).create({
      channel: { id: channelId },
      message: message
    });
    await getRepository(ChannelMessage).save(msg);
    return msg;
  }

  async createChannelModeration(channelId: number, userId: number, admin: User, type: ChannelModerationType, reason: string, duration: number): Promise<ChannelModeration> {
    const moderation = getRepository(ChannelModeration).create({
      channel: { id: channelId },
      user: { id: userId },
      admin: admin,
      type: type,
      expire_at: new Date(new Date().getTime() + duration)
    });
    if (reason)
      moderation.reason = reason;
    return await getRepository(ChannelModeration).save(moderation);
  }

  async createDirectMessage(to: User, message: Message): Promise<DirectMessage> {
    const msg = getRepository(DirectMessage).create({
      to: to,
      message: message
    });
    await getRepository(DirectMessage).save(msg);
    return msg;
  }

  async deleteChannel(channelId: number) {
    await getRepository(ChannelModeration).delete({channel: {id: channelId}})
    await getRepository(ChannelInvitation).delete({channel: {id: channelId}});
    await getRepository(ChannelMessage).delete({channel: {id: channelId}});
    await getRepository(ChannelMember).delete({channel: {id: channelId}})
    await getRepository(Channel).delete({ id: channelId });
  }

  async editChannelMember(channelId: number, user: User, role: ChannelMemberRole): Promise<ChannelMember> {
    const member = await getRepository(ChannelMember).findOne({
      channel: { id: channelId },
      user: { id: user.id }
    });
    member.role = role;
    return getRepository(ChannelMember).save(member);
  }

  async findChannel(channelId: number): Promise<Channel> {
    return getRepository(Channel).findOne({
      relations: ['owner'],
      where: { id: channelId }
    });
  }

  async getChannelMember(channelId: number, userId: number): Promise<ChannelMember> {
    return await getRepository(ChannelMember).findOne({
      relations: ['user'],
      where: { channel: { id: channelId }, user: {id: userId} }
    });
  }

  async getChannelMembers(channelId: number): Promise<ChannelMember[]> {
    return await getRepository(ChannelMember).find({
      relations: ['user'],
      where: { channel: { id: channelId } }
    });
  }

  async getChannelMessages(channelId: number, maxDate: Date, maxMessages: number): Promise<Message[]> {
    return (await getRepository(ChannelMessage).find({
      relations: ['message', 'message.from'],
      where: { channel: { id: channelId }, message: { sent_at: LessThanOrEqual(maxDate) } }
    }).then(messages => messages.map(m => m.message))).slice(0, maxMessages);
  }

  async isBanned(user: User, channelId: number): Promise<boolean> {
    return await getRepository(ChannelModeration).findOne({
      where: {
        channel: { id: channelId },
        user: user,
        type: ChannelModerationType.BAN,
        expire_at: MoreThanOrEqual(new Date()), // TODO: check null
        pardon_at: IsNull()
      }
    }).then(ban => !!ban);
  }

  async isInvited(channelId: number, user: User): Promise<boolean> {
    return await getRepository(ChannelInvitation).findOne({
      where: {
        channel: { id: channelId },
        to: user
      }
    }).then(invitation => !!invitation);
  }


  async isMuted(user: User, channelId: number): Promise<boolean> {
    return await getRepository(ChannelModeration).findOne({
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
    let member = await getRepository(ChannelMember).save({
      channel: { id: channelId },
      user: user,
      role: role
    });
    await getRepository(ChannelInvitation).delete({
      channel: { id: channelId },
      to: user
    });
    return member;
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

  async updateChannel(channel: Channel): Promise<Channel> {
    return getRepository(Channel).save(channel);
  }
  
  async updateMemberRole(channelId : number, userId : number, role : ChannelMemberRole): Promise<ChannelMember> {
    return getRepository(ChannelMember).save({
      channel: { id: channelId },
      user: { id: userId },
      role: role
    });
  }
}
