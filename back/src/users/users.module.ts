import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { Avatar } from './entities/avatar.entity';
import { User } from './entities/user.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([
    Achievement,
    Avatar,
    User,
    UserAchievement
  ])],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
