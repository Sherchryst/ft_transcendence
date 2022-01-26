import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ length: 32, nullable: true, default: () => 'null' })
  twofa!: string;
}
