import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { GetUserProfileDto } from './dto/get-user-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('get-user-profile')
  async getUserProfile(@Body() dto: GetUserProfileDto): Promise<string> {
    const user = await this.usersService.findOne(dto.userId);
    if (!user)
      throw new NotFoundException();
    const achievements = await this.usersService.getUserAchievements(dto.userId);
    const friends = await this.usersService.getFriends(dto.userId);
    return JSON.stringify({
      ...user, twofa: undefined,
      achievements,
      friends: friends.map(({ id, nickname }) => ({ id, nickname }))
    });
  }
}
