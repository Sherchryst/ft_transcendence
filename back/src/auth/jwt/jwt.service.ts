import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomJwtService {
  constructor(
    private jwtService: JwtService
  ) {}

  login(user: any, with2fa = false) {
    const payload = { sub: user.id, isSecondFactorAuth: with2fa };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
