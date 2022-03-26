import { Injectable } from '@nestjs/common';
import { createReadStream, readFileSync } from 'fs';
import { ChannelMember } from 'src/chat/entities/channel-member.entity';
import { Channel } from 'src/chat/entities/channel.entity';
import { getRepository, Not } from 'typeorm';
import { Avatar } from './entities/avatar.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { UserRelationship, UserRelationshipType } from './entities/user-relationship.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private async getRelationships(fromUserId: number, type: UserRelationshipType): Promise<User[]> {
    return getRepository(UserRelationship).find({
      relations: ['to'],
      where: { from: fromUserId, type: type }
    }).then(relations => relations.map(r => r.to));
  }

  async acceptFriendRequest(fromUserId: number, toUserId: number) {
    await getRepository(UserRelationship).update({
      from: { id: fromUserId }, to: { id: toUserId }
    }, { type: UserRelationshipType.FRIEND });
    await getRepository(UserRelationship).delete({
      from: { id: toUserId }, to: { id: fromUserId }
    });
    // As friend relationship is symmetric, we need to create the reverse relationship
    await getRepository(UserRelationship).save({
      from: { id: toUserId }, to: { id: fromUserId }, type: UserRelationshipType.FRIEND
    });
  }

  async blockUser(fromUserId: number, toUserId: number) {
    await getRepository(UserRelationship).delete({
      from: { id: fromUserId }, to: { id: toUserId }
    });
    await getRepository(UserRelationship).save({
      from: { id: fromUserId }, to: { id: toUserId }, type: UserRelationshipType.BLOCK
    });
    // We need to delete the reverse relationship if it exists
    await getRepository(UserRelationship).delete({
      from: { id: toUserId }, to: { id: fromUserId }, type: Not(UserRelationshipType.BLOCK)
    });
  }

  async create(login: string): Promise<User> {
    const defaultAvatar = readFileSync('./blank-avatar.jpg');
    const avatar = await getRepository(Avatar).save({
      user: { login: login },
      data: defaultAvatar
    });
    const repo = getRepository(User);
    const user = repo.create({
      login: login,
      nickname: login,
      avatar: avatar
    });
    return await repo.save(user);
  }

  async findAll(): Promise<User[]> {
    return await getRepository(User).find();
  }

  async findByLogin(login: string): Promise<User> {
    return await getRepository(User).findOne({
      where: { login: login }
    });
  }

  async findOne(userId: number): Promise<User> {
    return await getRepository(User).findOne(userId);
  }

  async getAvatar(userId: number): Promise<Avatar> {
    const user = await getRepository(User).findOne(userId, {
      relations: ['avatar']
    });
    return user ? user.avatar : null;
  }

  async getBlockedUsers(userId: number): Promise<User[]> {
    return await this.getRelationships(userId, UserRelationshipType.BLOCK);
  }

  async getFriends(userId: number): Promise<User[]> {
    return await this.getRelationships(userId, UserRelationshipType.FRIEND);
  }

  async getFriendRequests(userId: number): Promise<User[]> {
    return await getRepository(UserRelationship).find({
      relations: ['from'],
      where: { to: { id: userId }, type: UserRelationshipType.PENDING }
    }).then(relations => relations.map(r => r.from));
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return await getRepository(UserAchievement).find({
      relations: ['achievement'],
      where: { user: userId }
    });
  }

  async getAllChannelsConnected(userId: number): Promise<Channel[]> {
    return  await getRepository(ChannelMember).find({
      relations: ['channel'],
      where: { user: userId }
    }).then(relations => relations.map(r => r.channel));
  }

  async hasSentFriendRequest(fromUserId: number, toUserId: number): Promise<boolean> {
    return await getRepository(UserRelationship).findOne({
      where: { from: fromUserId, to: toUserId, type: UserRelationshipType.PENDING }
    }) != null;
  }

  async isBlockedBy(fromUserId: number, toUserId: number): Promise<boolean> {
    return await getRepository(UserRelationship).findOne({
      where: { from: fromUserId, to: toUserId, type: UserRelationshipType.BLOCK }
    }) != null;
  }

  async sendFriendRequest(fromUserId: number, toUserId: number): Promise<UserRelationship> {
    return await getRepository(UserRelationship).save({
      from: { id: fromUserId },
      to: { id: toUserId },
      type: UserRelationshipType.PENDING
    });
  }

  async set2fa(userId: number, value: boolean) {
    return getRepository(User).update({id: userId}, {
      twofa: value
    })
  }

  async set2faSecret(userId: number, secret: string) {
    return getRepository(User).update({id: userId}, {
      twofaSecret: secret
    });
  }

  async unblockUser(fromUserId: number, toUserId: number) {
    await getRepository(UserRelationship).delete({
      from: { id: fromUserId },
      to: { id: toUserId },
      type: UserRelationshipType.BLOCK
    });
  }

  async unlockAchievement(userId: number, achievementId: number): Promise<UserAchievement> {
    return await getRepository(UserAchievement).save({
      user: { id: userId },
      achievement: { id: achievementId }
    });
  }

  async updateAvatar(avatarId: number, data: Buffer) {
    await getRepository(Avatar).update(avatarId, {
      data: data
    });
  }

  async updateNickname(userId: number, nickname: string) {
    await getRepository(User).update(userId, {
      nickname: nickname,
      newUser: false
    });
  }
}

