import { Column, Entity, ManyToOne } from 'typeorm';
import { Achievement } from './achievement.entity';
import { User } from './user.entity';

@Entity()
export class UserAchievement {
  @ManyToOne(() => User, u => u.id, { primary: true })
  user: User;

  @ManyToOne(() => Achievement, achievement => achievement.id, { primary: true })
  achievement: Achievement;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  unlocked_at: Date;
}
