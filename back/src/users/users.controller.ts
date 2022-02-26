import { Body, ConflictException, Controller, Get, NotFoundException, Post, Query, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('accept-friend-request')
  async acceptFriendRequest(@Body() dto: { fromId: number, toId: number }) {
    const r = await this.usersService.hasSentFriendRequest(dto.fromId, dto.toId);
    if (!r)
      throw new UnauthorizedException('User has not sent friend request');
    await this.usersService.acceptFriendRequest(dto.fromId, dto.toId);
  }

  @Post('block-user')
  async blockUser(@Body() dto: { fromId: number, toId: number }) {
    try {
      await this.usersService.blockUser(dto.fromId, dto.toId);
    } catch (error) {
      throw new UnauthorizedException('User is already blocked');
    }
  }

  @Get('get-friend-requests')
  async getFriendRequests(@Query('id') id: number) {
    const requests = await this.usersService.getFriendRequests(id);
    return JSON.stringify(requests.map(({ id, nickname }) => ({ id, nickname })));
  }

  @Get('get-profile')
  async getProfile(@Query('id') id: number) {
    const user = await this.usersService.findOne(id);
    if (!user)
      throw new NotFoundException();
    /*
    * TODO: Add requests for achievements
    */
    const achievements = await this.usersService.getUserAchievements(id);
    /*
    * TODO: Add requests for friends
    */
    const friends = await this.usersService.getFriends(id);
    /* TODO: Add relationship status with current user
      - User can be blocked
      - User can unblock user
      - User can be friend
      - User can accept friend request
      - User can send friend request
    */
    return JSON.stringify({
      user,
      achievements,
      friends: friends.map(({ id, nickname }) => ({ id, nickname }))
    });
  }

  @Post('send-friend-request')
  async sendFriendRequest(@Body() dto: { fromId: number, toId: number }) {
    try {
      if (await this.usersService.isBlockedBy(dto.toId, dto.fromId)
      || !(await this.usersService.sendFriendRequest(dto.fromId, dto.toId)))
        throw new UnauthorizedException();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @Post('unblock-user')
  async unblockUser(@Body() dto: { fromId: number, toId: number }) {
    try {
      await this.usersService.unblockUser(dto.fromId, dto.toId);
    } catch (error) {
      throw new UnauthorizedException('User is not blocked');
    }
  }

  @Post('update-nickname')
  async updateNickname(@Body() dto: { id: number, nickname: string }) {
    try {
      await this.usersService.updateNickname(dto.id, dto.nickname);
    } catch (error) {
      throw new ConflictException('Nickname is already taken');
    }
  }
}
