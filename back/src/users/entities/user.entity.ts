import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Avatar } from './avatar.entity';
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
  @Exclude()
  twofaSecret: string;

  @Column({ default: false })
  @Exclude()
  twofa: boolean;

  @OneToMany(() => UserAchievement, a => a.user)
  userAchievements: UserAchievement[];

  @OneToMany(() => UserRelationship, r => r.from)
  userRelationships: UserRelationship[];

  @OneToOne(() => Avatar, { nullable: false })
  @JoinColumn()
  avatar: Avatar;

  @Column({ default: true})
  newUser: boolean;
}
