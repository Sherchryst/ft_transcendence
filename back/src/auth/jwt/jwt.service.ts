import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomJwtService {
  constructor(
    private jwtService: JwtService
  ) {}

  login(user: any) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
