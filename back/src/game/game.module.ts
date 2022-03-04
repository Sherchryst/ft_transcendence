import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { CustomJwtService } from 'src/auth/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from '../auth/auth.module'

@Module({
  controllers: [GameController],
  imports: [UsersModule, AuthModule],
  providers: [GameService, GameGateway]
})
export class GameModule {}
