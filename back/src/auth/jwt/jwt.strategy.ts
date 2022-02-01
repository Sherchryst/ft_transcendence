import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UsersService } from 'src/users/users.service';

export type JwtPayload = { sub: string, isSecondFactorAuth: boolean };

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies['jwt'];
        }
        return token
      },
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(Number(payload.sub))
    if (!user.isTwoFactorAuthenticationEnabled || payload.isSecondFactorAuth) {
      return user;
    }
  }
}