import { ClassSerializerInterceptor, Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { Jwt2faGuard } from 'src/auth/jwt/jwt.guard';
import { MatchService } from './match.service';

@Controller('match')
@UseGuards(Jwt2faGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class MatchController {
  constructor(private matchsService: MatchService) {}

  @Get('get-history')
  async getHistory(@Query('userId') userId: number, @Query('limit') limit: number) {
    return await this.matchsService.getHistory(userId, limit);
  }

  @Get('get-winrate')
  async getWinrate(@Query('userId') userId: number) {
    const winrate = await this.matchsService.getWinrate(userId);
    return { winrate: winrate };
  }

  @Get('match-count')
  async matchCount(@Query('userId') userId: number) {
    const count = await this.matchsService.matchCount(userId);
    return { count: count };
  }
}
