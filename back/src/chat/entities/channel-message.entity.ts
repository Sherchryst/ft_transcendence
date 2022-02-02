import { Entity, ManyToOne } from 'typeorm';
import { Channel } from './channel.entity';
import { Message } from './message.entity';

@Entity()
export class ChannelMessage {
  @ManyToOne(() => Channel, c => c.id, { primary: true })
  channel: Channel;

  @ManyToOne(() => Message, m => m.id, { primary: true })
  message: Message;
}
