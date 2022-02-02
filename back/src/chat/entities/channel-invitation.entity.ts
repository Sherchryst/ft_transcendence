import { Column, Entity, ManyToOne } from 'typeorm';
import { Channel } from './channel.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class ChannelInvitation {
  @ManyToOne(() => Channel, c => c.id, { primary: true })
  channel: Channel;

  @ManyToOne(() => User, u => u.id, { primary: true })
  to: User;

  @ManyToOne(() => User, u => u.id, { nullable: false })
  from: User;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  sent_at: Date;
}
