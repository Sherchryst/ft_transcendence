import { AuthModule } from '../auth/auth.module'
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { Match } from './entities/match.entity';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { StatusGateway } from 'src/users/users.gateway';

@Module({
  controllers: [MatchController],
  imports: [TypeOrmModule.forFeature([
    Match]), UsersModule, AuthModule],
  providers: [GameService, MatchService, GameGateway, StatusGateway]
})
export class GameModule {}
