import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserAchievement } from './user-achievement.entity';
import { UserRelationship } from './user-relationship.entity';

export enum UserRole {
  ADMIN = 'admin',
  BANNED = 'banned',
  USER = 'user'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32, unique: true })
  login: string;

  @Column({ length: 32, unique: true })
  nickname: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ default: 0 })
  mmr: number;

  @Column({ length: 32, default: '' })
  twofa: string;

  @OneToMany(() => UserAchievement, a => a.user)
  userAchievements: UserAchievement[];

  @OneToMany(() => UserRelationship, r => r.from)
  userRelationships: UserRelationship[];
}
