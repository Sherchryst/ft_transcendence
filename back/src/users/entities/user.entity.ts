import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserAchievement } from './user-achievement.entity';
import { UserRelationship } from './user-relationship.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32, unique: true })
  login: string;

  @Column({ length: 32, unique: true })
  nickname: string;

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

  @Column({ default: true, nullable: false })
  newUser: boolean;

  @Column({ length: 64, default: 'avatars/default.jpg', nullable: false })
  avatarPath: string;
}
