import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, u => u.id, { nullable: false })
  player1: User;

  @ManyToOne(() => User, u => u.id, { nullable: true }) // null = bot
  player2: User;

  @Column({ default: 0 })
  score1: number;

  @Column({ default: 0 })
  score2: number;

  @Column({ default: 0 })
  winner: number;

  @Column({ default: 0 })
  map: number;
}
