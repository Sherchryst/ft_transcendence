import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

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

  verify(token: string) {
    return this.jwtService.verify(token, {secret:jwtConstants.secret})
  }
}

export function getJwtFromSocket(socket: any): string {
  let jwt
  const cookies = socket.handshake?.headers?.cookie.split(';').map(v => v.split('='));
  cookies.forEach((v) => {
      if (v[0].trim() === "jwt") {
          jwt = v[1].trim();
      }
  })
  return jwt
}