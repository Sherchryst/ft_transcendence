
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from 'src/users/users.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './forty-two.strategy';
import { JwtAuthStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';  
import { jwtConstants } from './constants';
import { Repository } from 'typeorm';
@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    Repository,
    JwtModule.register({secret: jwtConstants.secret})
  ],
  providers: [AuthService, FortyTwoStrategy, JwtAuthStrategy],
  exports: [AuthService],
})
export class AuthModule {}
