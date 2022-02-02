import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from './channel.entity';
import { User } from '../../users/entities/user.entity';

export enum ChannelMemberRole {
  ADMIN = 'admin',
  MEMBER = 'member'
}

@Entity()
export class ChannelMember {
  @ManyToOne(() => Channel, c => c.id, { primary: true })
  channel: Channel;

  @ManyToOne(() => User, u => u.id, { primary: true })
  user: User;

  @Column({ type: 'enum', enum: ChannelMemberRole, default: ChannelMemberRole.MEMBER })
  role: ChannelMemberRole;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  last_read_at: Date;
}
