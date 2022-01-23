import { Controller, Get, Redirect, Request, Res, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './forty-two-auth.guard';
import { JwtAuthGuard } from './jwt.guard';
import { Logger } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login42')
  @UseGuards(FortyTwoAuthGuard)
  async login(){
    return ;
  }

  @Get('test')
  @UseGuards(JwtAuthGuard)
  test(@Request() req) {
    return 'logged'
  }

  @Get('redirect')
  @UseGuards(FortyTwoAuthGuard)
  async redirect(@Request() req, @Res() res) {
    const { access_token } = this.authService.login(req.user)
    res.cookie('jwt', access_token)
    res.redirect("http://localhost:8080")
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req, @Res() res) {
    res.clearCookie('jwt')
    res.send("logged out")
  }

}
