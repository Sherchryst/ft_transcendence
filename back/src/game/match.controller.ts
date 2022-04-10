import { Body, Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Jwt2faGuard } from 'src/auth/jwt/jwt.guard';
import { MatchService } from './match.service';

@Controller('match')
//@UseGuards(Jwt2faGuard)
export class MatchController {
  constructor(private matchsService: MatchService) {}

  @Get('get-history')
  async profile(@Query('userId') userId: number, @Query('limit') limit: number) {
    const history = await this.matchsService.getHistory(userId, limit);
    return JSON.stringify(history);
  }

  @Get('get-winrate')
  async winrate(@Query('userId') userId: number) {
    const winrate = await this.matchsService.getWinrate(userId);
    return { winrate: winrate };
  }

  @Get('match-count')
  async matchCount(@Query('userId') userId: number) {
    const count = await this.matchsService.matchCount(userId);
    return { count: count };
  }
}
