import { Controller, Get, Redirect, Request, Res, Post, UseGuards } from '@nestjs/common';
import { CustomJwtService } from './jwt/jwt.service';
import { FortyTwoAuthGuard } from './42/forty-two-auth.guard';
import { Jwt2faGuard } from './jwt/jwt.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private customJwtService: CustomJwtService,
    private usersService: UsersService) {}

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
    res.redirect("http://localhost:8080/#/login?is2fa=" + req.user.twofa)
  }

  @Post('logout')
  async logout(@Request() req, @Res() res) {
    res.clearCookie('jwt', {sameSite: "Lax"})
    res.send("logged out")
  }

  @Get('cheat_login')
  async cheat_login(@Res() res) {
    const username = "cheat_user";
    let user = await this.usersService.findByLogin(username);
    if (!user)
      user = await this.usersService.create(username);
    const { access_token } = this.customJwtService.login(user)
    res.cookie('jwt', access_token, {sameSite: "Lax"});
    res.redirect("http://localhost:8080/#/login?is2fa=" + user.twofa);
  }
}
