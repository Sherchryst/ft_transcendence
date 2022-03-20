import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { CustomJwtService } from 'src/auth/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from '../auth/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { MatchService } from './match.service';

@Module({
  controllers: [GameController],
  imports: [TypeOrmModule.forFeature([
    Match]), UsersModule, AuthModule],
  providers: [GameService, MatchService, GameGateway]
})
export class GameModule {}
