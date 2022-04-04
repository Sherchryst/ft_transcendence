import { Achievement } from './entities/achievement.entity';
import { AuthModule } from 'src/auth/auth.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { UsersController } from './users.controller';
import { UsersGateway } from './users.gateways';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([
    Achievement,
    User,
    UserAchievement,
  ]),
  forwardRef(() => AuthModule)
],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
