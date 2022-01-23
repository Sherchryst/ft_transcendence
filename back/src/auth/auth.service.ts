import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) {}

  login(user: any) {
    const payload = { sub: user.username };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
