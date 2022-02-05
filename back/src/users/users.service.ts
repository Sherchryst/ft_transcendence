import { Injectable } from '@nestjs/common';
import { getManager, getRepository } from 'typeorm';
import { UserAchievement } from './entities/user-achievement.entity';
import { UserRelationship, UserRelationshipType } from './entities/user-relationship.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  async create(login: string): Promise<User> {
    const repo = getRepository(User);
    const newUser = repo.create({
      login: login,
      nickname: login
    });
    await repo.save(newUser);
    return newUser;
  }

  async delete(id: number): Promise<void> {
    await getManager().delete(User, id);
  }

  findAll(): Promise<User[]> {
    return getRepository(User).find();
  }

  findOne(id: number): Promise<User> {
    return getRepository(User).findOne(id);
  }

  findByLogin(login: string): Promise<User> {
    return getRepository(User).findOne({
      where: { login: login }
    });
  }

  async getFriends(userId: number): Promise<User[]> {
    return getRepository(UserRelationship).find({
      relations: ['to'],
      where: { from: { id: userId }, type: UserRelationshipType.FRIEND }
    }).then(relations => relations.map(r => r.to));
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return getRepository(UserAchievement).find({
      relations: ['achievement'],
      where: { user: { id: userId } }
    });
  }

  async set2faSecret(userId: number, secret: string) {
    return getRepository(User).update({id: userId}, {
      twofaSecret: secret
    });
  }

  async set2fa(userId: number, value: boolean) {
    return getRepository(User).update({id: userId}, {
      twofa: value
    })
  }

}
