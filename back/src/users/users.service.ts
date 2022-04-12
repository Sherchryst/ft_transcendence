import { Channel } from 'src/chat/entities/channel.entity';
import { ChannelMember } from 'src/chat/entities/channel-member.entity';
import { createWriteStream } from 'fs';
import { getManager, getRepository, Not } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { UserRelationship, UserRelationshipType } from './entities/user-relationship.entity';
import * as PostgresError from '@fiveem/postgres-error-codes'
import { Achievement } from './entities/achievement.entity';

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
    const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    const repo = getRepository(User);
    do
      try {
        const user = repo.create({
          login: login,
          nickname: genRanHex(32)
        });
        return await repo.save(user);
      } catch (e) {
        if (e.code !== PostgresError.PG_UNIQUE_VIOLATION)
          throw e;
      }
    while (true);
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

  async getUserAchievements(userId: number): Promise<any[]> {
    return await getManager().query(
      'SELECT a.id, a.name, a.description, ua.unlocked_at ' +
      'FROM achievement a ' +
      'LEFT JOIN user_achievement ua ' +
      'ON a.id = ua.achievement_id AND ua.user_id = $1' +
      'ORDER BY ua.unlocked_at, a.name',
      [userId]
    );
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

  async topTen() {
    return await getManager().query(
      'SELECT u.id, u.login, u.nickname, u.xp, u.avatar_path, COUNT(m) AS wins, t.total, COUNT(m)::float / t.total AS win_rate ' +
      'FROM "user" u ' +
      'LEFT OUTER JOIN "match" m ' +
      'ON m.mode = \'ranked\' ' +
      'AND m.winner_id = u.id ' +
      'JOIN ( ' +
      '  SELECT u.id, COUNT(m) AS total ' +
      '  FROM "user" u ' +
      '  JOIN "match" m ' +
      '  ON m.mode = \'ranked\' ' +
      '  AND (m.player1_id = u.id OR m.player2_id = u.id) ' +
      '  AND m.winner_id IS NOT NULL ' +
      '  GROUP BY u.id ' +
      ') t ' +
      'ON t.id = u.id ' +
      'GROUP BY u.id, t.total ' +
      'ORDER BY xp DESC ' +
      'LIMIT 10'
    );
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

  async updateAvatar(userId: number, data: Buffer) {
    const ws = createWriteStream(`${__dirname}/../../public/avatars/${userId}.jpg`);
    ws.write(data);
    ws.end();
    await getRepository(User).update({id: userId}, {
      avatarPath: `avatars/${userId}.jpg`
    });
  }

  async updateNickname(userId: number, nickname: string) {
    await getRepository(User).update(userId, {
      nickname: nickname,
      newUser: false
    });
  }
}

