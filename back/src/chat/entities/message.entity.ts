import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, u => u.id, { nullable: false })
  from: User;

  @Column({ length: 512 })
  content: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  sent_at: Date;
}
