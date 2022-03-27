import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Map } from './map.entity';

export enum MatchType {
  CASUAL = 'casual',
  RANKED = 'ranked'
}

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Map, m => m.id)
  map: Map;

  @ManyToOne(() => User, u => u.id, { nullable: false })
  player1: User;

  @ManyToOne(() => User, u => u.id, { nullable: true })
  player2: User;

  @Column({ nullable: true })
  mode: MatchType;

  @Column()
  begin_at: Date;

  @Column({ nullable: true })
  end_at!: Date;

  @ManyToOne(() => User, u => u.id, { nullable: true })
  winner!: User;

  @Column({ default: 0 })
  score1: number;

  @Column({ default: 0 })
  score2: number;
}
