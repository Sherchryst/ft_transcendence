import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Post,
    UseInterceptors,
    Res,
    UseGuards,
    Req,
    UnauthorizedException,
    Body,
    HttpCode
  } from '@nestjs/common';
  import { TwoFactorService } from './twoFactor.service';
  import { JwtAuthGuard } from '../jwt/jwt.guard';
  import { UsersService } from 'src/users/users.service';
  import { TwoFactorDto } from './twoFactor.dto';
   
  @Controller('2fa')
  @UseInterceptors(ClassSerializerInterceptor)
  export class TwoFactorController {
    constructor(
      private readonly twoFactorService: TwoFactorService,
      private readonly usersService: UsersService,
    ) {}
   
    @Post('generate')
    @UseGuards(JwtAuthGuard)
    async register(@Res() response, @Req() request) {
      const { otpauthUrl } = await this.twoFactorService.generateTwoFactorAuthenticationSecret(request.user);
      return this.twoFactorService.pipeQrCodeStream(response, otpauthUrl);
    }

    @Post('turn-on')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async turnOnTwoFactorAuthentication(
      @Req() request,
      @Body() { twoFactorAuthenticationCode } : TwoFactorDto
    ) {
      const isCodeValid = this.twoFactorService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode, request.user
      );
      if (!isCodeValid) {
        throw new UnauthorizedException('Wrong authentication code');
      }
      await this.usersService.turnOnTwoFactorAuthentication(request.user.id);
      return "ok"
    }
    }