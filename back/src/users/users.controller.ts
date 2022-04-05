import { BadRequestException, Body, ConflictException, Controller, Get, NotFoundException, Post, Query, Req, ServiceUnavailableException, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Jwt2faGuard } from 'src/auth/jwt/jwt.guard';
import { UsersService } from './users.service';
import * as PostgresError from '@fiveem/postgres-error-codes'
import * as sharp from 'sharp';
import { UpdateNicknameDto } from './dto/update-nickname.dto';

export const imageFilter: any = (req: any, file: { mimetype: string, size: number }, callback: (arg0: any, arg1: boolean) => void): any =>
{
  const validExtension: Array<string> = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
  if (!validExtension.includes(file.mimetype))
    return callback(new BadRequestException('Only image files are allowed'), false);
  if (file.size > 1000000)
    return callback(new BadRequestException('Image must be less than 1MB'), false);
  return callback(null, true);
};

@Controller('users')
@UseGuards(Jwt2faGuard)
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
    if (!id)
      throw new BadRequestException('No id provided');
    const requests = await this.usersService.getFriendRequests(id);
    return JSON.stringify(requests.map(({ id, nickname }) => ({ id, nickname })));
  }


  @Get('profile')
  async profile(@Req() req) {
    const achievements = await this.usersService.getUserAchievements(req.user.id);
    const friends = await this.usersService.getFriends(req.user.id)
    return {user: req.user, friends: friends, achievements: achievements}
  }

  @Get('get-profile')
  async getProfile(@Query('id') id: number, @Query('login') login: string) {
    let user;
    if (id)
      user = await this.usersService.findOne(id);
    else if (login)
      user = await this.usersService.findByLogin(login);
    else
      throw new BadRequestException('No id nor login provided');
    if (!user)
      throw new NotFoundException('User not found');
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
  async updateNickname(@Body() dto: UpdateNicknameDto) {
    try {
      await this.usersService.updateNickname(dto.id, dto.nickname);
    } catch (error) {
      if (error.code === PostgresError.PG_UNIQUE_VIOLATION)
        throw new ConflictException('Nickname already taken');
      throw new ServiceUnavailableException();
    }
  }

  @Post('update-avatar')
  @UseInterceptors(FileInterceptor('file', { fileFilter: imageFilter }))
  async updateAvatar(@UploadedFile() file: Express.Multer.File, @Body() body: { id : number }) {
    if (!file)
      throw new BadRequestException('No file uploaded');
    const user = await this.usersService.findOne(body.id);
    if (!user)
      throw new NotFoundException('User not found');
    let buffer = await sharp(file.buffer)
    .resize(400, 400).toFormat('jpeg').jpeg({ quality: 90 }).toBuffer();
    await this.usersService.updateAvatar(user.id, buffer);
  }
}
