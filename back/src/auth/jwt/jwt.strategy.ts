import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { In } from 'typeorm';
import { getJwtFromSocket } from './jwt.service';

export type JwtPayload = { sub: string, isSecondFactorAuth: boolean };

function extractJwt(req): any {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token
}

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService,
              private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: extractJwt,
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(Number(payload.sub))
    return user;
  }
}

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: extractJwt,
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(Number(payload.sub))
    if (!user.twofa || payload.isSecondFactorAuth) {
      return user;
    }
  }
}

@Injectable()
export class WsJwt2faStrategy extends PassportStrategy(Strategy, 'ws-jwt-2fa') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: getJwtFromSocket,
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(Number(payload.sub))
    if (!user.twofa || payload.isSecondFactorAuth) {
      return user;
    }
  }
}