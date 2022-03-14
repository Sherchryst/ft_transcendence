import { BadRequestException, Body, ClassSerializerInterceptor, ConflictException, Controller, Get, HttpException, NotFoundException, Post, Query, Req, Response, StreamableFile, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'typeorm/platform/PlatformTools';
import { UsersService } from './users.service';
import * as sharp from 'sharp';

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
  async updateNickname(@Body() dto: { id: number, nickname: string }) {
    if (dto.nickname.slice(0, 4) === 'anon')
      throw new ConflictException('forbidden prefix : anon');
    try {
      await this.usersService.updateNickname(dto.id, dto.nickname);
    } catch (error) {
      throw new ConflictException('Nickname is already taken');
    }
  }

  @Get('get-avatar')
  async getAvatar(@Query('id') id: number, @Response({ passthrough: true }) res) {
    const avatar = await this.usersService.getAvatar(id);
    if (!avatar)
      throw new HttpException('Avatar not found', 404);
    const stream = Readable.from(avatar.data);
    res.set({
      'Content-Disposition': 'inline',
      'Content-Type': 'image'
    });
    return new StreamableFile(stream);
  }

  @Post('update-avatar')
  @UseInterceptors(FileInterceptor('file', { fileFilter: imageFilter }))
  async updateAvatar(@Query('id') id: number, @UploadedFile() file: Express.Multer.File) {
    const avatar = await this.usersService.getAvatar(id);
    if (!avatar)
      throw new NotFoundException('User not found');
    var buffer = await sharp(file.buffer)
    .resize(400).toFormat('jpeg').jpeg({ quality: 90 }).toBuffer();
    await this.usersService.updateAvatar(avatar.id, buffer);
  }
}
