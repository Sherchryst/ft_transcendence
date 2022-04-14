import { Check, Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export enum UserRelationshipType {
  BLOCK = 'block',
  FRIEND = 'friend',
  PENDING = 'pending'
}

@Entity()
@Check('from_id <> to_id')
export class UserRelationship {
  @ManyToOne(() => User, u => u.id, { primary: true })
  from: User;

  @ManyToOne(() => User, u => u.id, { primary: true })
  to: User;

  @Column({ type: 'enum', enum: UserRelationshipType })
  type: UserRelationshipType;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
