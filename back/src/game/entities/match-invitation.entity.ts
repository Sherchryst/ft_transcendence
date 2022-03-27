import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Map } from './map.entity';

@Entity()
export class MatchInvitation {
  @ManyToOne(() => User, u => u.id, { primary: true })
  from: User;

  @ManyToOne(() => User, u => u.id, { primary: true })
  to: User;

  @ManyToOne(() => Map, m => m.id, { nullable: false })
  map: Map;

  @Column()
  sentAt: Date;
}
