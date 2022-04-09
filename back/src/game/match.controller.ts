import { Body, Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Jwt2faGuard } from 'src/auth/jwt/jwt.guard';
import { MatchService } from './match.service';

@Controller('match')
@UseGuards(Jwt2faGuard)
export class MatchController {
  constructor(private matchsService: MatchService) {}

  @Get('get-history')
  async profile(@Body() dto: { userId: number, limit: number }) {
    const history = this.matchsService.getHistory(dto.userId, dto.limit);
    return JSON.stringify(history);
  }

  @Get('match-count')
  async matchCount(@Body() dto: { userId: number }) {
    const count = this.matchsService.matchCount(dto.userId);
    return JSON.stringify(count);
  }
}
