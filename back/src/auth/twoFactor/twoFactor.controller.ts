import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    UseInterceptors,
    Res,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { TwoFactorService } from './twoFactor.service';
  import { JwtAuthGuard } from '../jwt/jwt.guard';
   
  @Controller('2fa')
  @UseInterceptors(ClassSerializerInterceptor)
  export class TwoFactorController {
    constructor(
      private readonly twoFactorAuthenticationService: TwoFactorService,
    ) {}
   
    @Get('generate')
    @UseGuards(JwtAuthGuard)
    async register(@Res() response, @Req() request) {
      const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(request.user);
      return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
    }
  }