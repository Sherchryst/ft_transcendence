import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { UsersService } from '../../users/users.service';
import { toFileStream } from 'qrcode';
import { User } from '../../users/entities/user.entity'
 
@Injectable()
export class TwoFactorService {
  constructor (
    private readonly usersService: UsersService
  ) {}
 
  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
 
    const otpauthUrl = authenticator.keyuri(user.username, "Pong", secret);
 
    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
 
    return {
      secret,
      otpauthUrl
    }
  }

  public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret
    })
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

}