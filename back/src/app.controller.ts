import { Controller, Get, UseGuards } from '@nestjs/common';
import { Jwt2faGuard } from './auth/jwt/jwt.guard';

@Controller()
@UseGuards(Jwt2faGuard)
export class AppController {
  @Get('ping')
  async ping() {
    return 'pong';
  }
}