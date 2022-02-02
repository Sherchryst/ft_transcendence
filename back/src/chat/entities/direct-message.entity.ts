import { Column, Entity, ManyToOne } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class DirectMessage {
  @ManyToOne(() => Message, m => m.id, { primary: true })
  message: Message;

  @ManyToOne(() => User, u => u.id, { primary: true })
  to: User;

  @Column('timestamp', { default: () => 'null' })
  read_at: Date;
}
