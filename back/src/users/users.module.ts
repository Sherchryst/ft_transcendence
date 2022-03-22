import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { Avatar } from './entities/avatar.entity';
import { User } from './entities/user.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersGateway } from './users.gateways';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([
    Achievement,
    Avatar,
    User,
    UserAchievement,
  ]),
  forwardRef(() => AuthModule)
],
  providers: [UsersService, UsersGateway],
  exports: [UsersService],
})
export class UsersModule {}
