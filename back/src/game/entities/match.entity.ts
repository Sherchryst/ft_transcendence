import { Check, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { GameMap } from './game-map.entity';

export enum MatchType {
  CASUAL = "casual",
  RANKED = "ranked",
}

@Entity()
@Check('player1_id <> player2_id')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GameMap, (m) => m.id)
  map: GameMap;

  @ManyToOne(() => User, (u) => u.id, { nullable: false })
  player1: User;

  @ManyToOne(() => User, (u) => u.id, { nullable: false })
  player2: User;

  @Column({ nullable: false })
  mode: MatchType;

  @Column()
  beginAt: Date;

  @Column({ nullable: true })
  endAt!: Date;

  @ManyToOne(() => User, (u) => u.id, { nullable: true })
  winner!: User;

  @Column({ default: 0 })
  score1: number;

  @Column({ default: 0 })
  score2: number;

  @Column({ nullable: false })
  level: number;
}
