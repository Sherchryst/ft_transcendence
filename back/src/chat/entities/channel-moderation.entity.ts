import { Column, Entity, ManyToOne } from 'typeorm';
import { Channel } from './channel.entity';
import { User } from '../../users/entities/user.entity';

export enum ChannelModerationType {
  BAN = 'ban',
  MUTE = 'mute'
}

@Entity()
export class ChannelModeration {
  @ManyToOne(() => Channel, c => c.id, { primary: true })
  channel: Channel;

  @ManyToOne(() => User, u => u.id, { primary: true })
  user: User;

  @ManyToOne(() => User, u => u.id, { nullable: false })
  admin: User;

  @Column({ type: 'enum', enum: ChannelModerationType })
  type: ChannelModerationType;

  @Column({ length: 128, default: 'No reason' })
  reason: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  begin_at: Date;

  @Column('timestamp', { nullable: true, default: () => 'null' })
  expire_at: Date;

  @Column('timestamp', { nullable: true, default: () => 'null' })
  pardon_at: Date;
}
