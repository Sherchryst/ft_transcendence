import { Achievement } from './entities/achievement.entity';
import { AuthModule } from 'src/auth/auth.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { StatusGateway } from './users.gateway';

@Module({
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([
    Achievement,
    User,
    UserAchievement,
  ]),
  forwardRef(() => AuthModule)
],
  providers: [UsersService, StatusGateway],
  exports: [UsersService],
})
export class UsersModule {}
