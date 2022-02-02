import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ChannelVisibility {
  PRIVATE = 'private',
  PUBLIC = 'public'
}

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32, unique: true })
  name: string;

  @ManyToOne(() => User, u => u.id, { nullable: false })
  owner: User;

  @Column({ type: 'enum', enum: ChannelVisibility, default: ChannelVisibility.PRIVATE })
  visibility: ChannelVisibility;

  @Column({ length: 32, nullable: true, default: () => 'null' })
  password!: string;
}
