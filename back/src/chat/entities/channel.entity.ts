import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import sha from 'sha.js'

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
  @Exclude()
  password!: string;

  @Column({ nullable: false, default: false })
  isPasswordSet: boolean;

  doesPasswordMatch(plainPassword: string): boolean {
    return sha('sha256').update(plainPassword).digest('hex') === this.password;
  }

  @BeforeInsert()
  private hashPassword(): void {
    if (this.password) {
      this.password = sha('sha256').update(this.password).digest('hex');
    }
  }
}
