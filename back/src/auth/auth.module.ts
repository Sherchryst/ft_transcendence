import { Module } from '@nestjs/common';
import { CustomJwtService } from './jwt/jwt.service'
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './42/forty-two.strategy';
import { JwtAuthStrategy } from './jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';  
import { jwtConstants } from './jwt/constants';
import { Repository } from 'typeorm';
import { TwoFactorController } from './twoFactor/twoFactor.controller';
import { TwoFactorService } from './twoFactor/twoFactor.service';
import { Jwt2faStrategy } from './jwt/jwt.strategy';
@Module({
  controllers: [AuthController, TwoFactorController],
  imports: [
    UsersModule,
    PassportModule,
    Repository,
    JwtModule.register({secret: jwtConstants.secret})
  ],
  providers: [CustomJwtService, FortyTwoStrategy, JwtAuthStrategy, Jwt2faStrategy, TwoFactorService],
  exports: [CustomJwtService]
})
export class AuthModule {}
