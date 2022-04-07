import { Module } from "@nestjs/common";
import { GameService } from "./game.service";
import { GameGateway } from "./game.gateway";
import { UsersModule } from "src/users/users.module";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Match } from "./entities/match.entity";
import { MatchService } from "./match.service";

@Module({
  imports: [TypeOrmModule.forFeature([Match]), UsersModule, AuthModule],
  providers: [GameService, MatchService, GameGateway],
})
export class GameModule {}
