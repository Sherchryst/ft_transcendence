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
  import { CustomJwtService } from '../jwt/jwt.service';
   
  @Controller('2fa')
  @UseInterceptors(ClassSerializerInterceptor)
  export class TwoFactorController {
    constructor(
      private readonly twoFactorService: TwoFactorService,
      private readonly usersService: UsersService,
      private readonly customJwtService: CustomJwtService
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
      @Req() req,
      @Body() { twoFactorAuthenticationCode } : TwoFactorDto
    ) {
      const isCodeValid = this.twoFactorService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode, req.user
      );
      if (!isCodeValid) {
        throw new UnauthorizedException('Wrong authentication code');
      }
      await this.usersService.turnOnTwoFactorAuthentication(req.user.id); 
    }

    @Post('authenticate')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async authenticate(
      @Req() req,
      @Body() { twoFactorAuthenticationCode } : TwoFactorDto,
      @Res() res
    ) {
      const isCodeValid = this.twoFactorService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode, req.user
      );
      if (!isCodeValid) {
        throw new UnauthorizedException('Wrong authentication code');
      }
      const access_token = this.customJwtService.login(req.user.id, true);
      res.cookie('jwt', access_token)
      res.send(req.user)
    }
  }