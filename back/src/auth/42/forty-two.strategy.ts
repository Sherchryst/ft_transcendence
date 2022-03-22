import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Profile, Strategy } from 'passport-42';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.FORTY_TWO_CLIENT_ID,
      clientSecret: process.env.FORTY_TWO_CLIENT_SECRET,
      callbackURL: `/auth/redirect`
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const {username} = profile
    let user = await this.usersService.findByLogin(username);
    if (!user)
      user = await this.usersService.create(username);
    console.log(user.nickname)
    return user
  }
}
