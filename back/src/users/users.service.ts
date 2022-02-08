import { Injectable } from '@nestjs/common';
import { getRepository, Not } from 'typeorm';
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

  create(login: string): User {
    const repo = getRepository(User);
    const user = repo.create({
      login: login,
      nickname: login
    });
    repo.save(user);
    return user;
  }

  findAll(): Promise<User[]> {
    return getRepository(User).find();
  }

  findByLogin(login: string): Promise<User> {
    return getRepository(User).findOne({
      where: { login: login }
    });
  }

  findOne(userId: number): Promise<User> {
    return getRepository(User).findOne(userId);
  }

  getBlockedUsers(userId: number): Promise<User[]> {
    return this.getRelationships(userId, UserRelationshipType.BLOCK);
  }

  getFriends(userId: number): Promise<User[]> {
    return this.getRelationships(userId, UserRelationshipType.FRIEND);
  }

  async getFriendRequests(userId: number): Promise<User[]> {
    return await getRepository(UserRelationship).find({
      relations: ['from'],
      where: { to: { id: userId }, type: UserRelationshipType.PENDING }
    }).then(relations => relations.map(r => r.from));
  }

  getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return getRepository(UserAchievement).find({
      relations: ['achievement'],
      where: { user: userId }
    });
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

  unlockAchievement(userId: number, achievementId: number) {
    getRepository(UserAchievement).save({
      user: { id: userId },
      achievement: { id: achievementId }
    });
  }

  async updateNickname(userId: number, nickname: string) {
    await getRepository(User).update(userId, {
      nickname: nickname
    });
  }
}
