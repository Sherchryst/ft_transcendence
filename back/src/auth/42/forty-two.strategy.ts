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
      callbackURL: process.env.FORTY_TWO_CALLBACK_URL
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const {username} = profile
    let user = await this.usersService.findOne(1);
    if (!user) {
      user = await this.usersService.create({
        username: username
      });
    }
    return user
  }
}
