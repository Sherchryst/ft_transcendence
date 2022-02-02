import { Controller, Get, Redirect, Request, Res, Post, UseGuards } from '@nestjs/common';
import { CustomJwtService } from './jwt/jwt.service';
import { FortyTwoAuthGuard } from './42/forty-two-auth.guard';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { Logger } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private customJwtService: CustomJwtService) {}

  @Get('login42')
  @UseGuards(FortyTwoAuthGuard)
  async login(){
    return ;
  }

  @Get('redirect')
  @UseGuards(FortyTwoAuthGuard)
  async redirect(@Request() req, @Res() res) {
    const { access_token } = this.customJwtService.login(req.user)
    res.cookie('jwt', access_token, {sameSite: "Lax"})
    res.redirect("http://localhost:8080/#?is2fa=" + req.user.isTwoFactorAuthenticationEnabled)
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req, @Res() res) {
    res.clearCookie('jwt', {sameSite: "Lax"})
    res.send("logged out")
  }
}
