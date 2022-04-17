import { BadRequestException, Body, ClassSerializerInterceptor, ConflictException, Controller, Get, NotFoundException, Post, Query, Req, ServiceUnavailableException, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Jwt2faGuard } from 'src/auth/jwt/jwt.guard';
import { UsersService } from './users.service';
import * as PostgresError from '@fiveem/postgres-error-codes'
import * as sharp from 'sharp';
import { UpdateNicknameDto } from './dto/update-nickname.dto';
import { instanceToPlain } from 'class-transformer';
import { User } from './entities/user.entity';
import { UserRelationshipType } from './entities/user-relationship.entity';

export const imageFilter: any = (req: any, file: { mimetype: string, size: number }, callback: (arg0: any, arg1: boolean) => void): any =>
{
  const validExtension: Array<string> = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
  if (!validExtension.includes(file.mimetype))
    return callback(new BadRequestException('Only image files are allowed'), false);
  if (file.size > (1 << 20))
    return callback(new BadRequestException('Image must be less than 1MB'), false);
  return callback(null, true);
};

@Controller('users')
@UseGuards(Jwt2faGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('accept-friend-request')
  async acceptFriendRequest(@Req() req, @Body() dto: { fromId: number }) {
    if (!dto.fromId)
      throw new BadRequestException('No fromId provided');
    const r = await this.usersService.hasSentFriendRequest(dto.fromId, req.user.id);
    console.log(r);
    if (!r)
      throw new UnauthorizedException('User has not sent friend request');
    await this.usersService.acceptFriendRequest(dto.fromId, req.user.id);
  }

  @Post('block-user')
  async blockUser(@Req() req, @Body() dto: { toId: number }) {
    if (!dto.toId)
      throw new BadRequestException('No toId provided');
    try {
      await this.usersService.blockUser(req.user.id, dto.toId);
    } catch (error) {
      throw new UnauthorizedException('User is already blocked');
    }
  }

  @Get('block-list')
  async blockList(@Req() req) {
    return await this.usersService.getBlockedUsers(req.user.id);
  }

  @Get('get-friend-requests')
  async getFriendRequests(@Query('id') id: number) {
    if (!id)
      throw new BadRequestException('No id provided');
    const requests = await this.usersService.getFriendRequests(id);
    return JSON.stringify(requests.map(({ id, nickname }) => ({ id, nickname })));
  }

  @Get('profile')
  async profile(@Req() req : any) {
    console.log('profile');
    const user = await this.usersService.findOne(req.user.id);
    const achievements = await this.usersService.getUserAchievements(req.user.id);
    const friends = await this.usersService.getFriends(req.user.id)
    return {user: { ...user, twofa: user.twofa } , friends: friends, achievements: achievements}
  }

  @Get('get-profile')
  async getProfile(@Query('id') id: number, @Query('login') login: string) {
    let user : User;
    if (id)
      user = await this.usersService.findOne(id);
    else if (login)
      user = await this.usersService.findByLogin(login);
    else
      throw new BadRequestException('No id nor login provided');
    if (!user)
      throw new NotFoundException('User not found');
    const achievements = await this.usersService.getUserAchievements(user.id);
    const friends = await this.usersService.getFriends(user.id);
    return JSON.stringify({
      user: instanceToPlain(user),
      achievements,
      friends: friends.map(({ id, nickname }) => ({ id, nickname }))
    });
  }

  @Get('is-2fa-enabled')
  async is2faEnabled(@Query('id') id: number) {
    if (!id)
      throw new BadRequestException('No id provided');
    const user = await this.usersService.findOne(id);
    if (!user)
      throw new NotFoundException('User not found');
    return user.twofa;
  }

  @Get('relationship-status')
  async relationshipStatus(@Req() req : any, @Query('id') id: number) {
    if (!id)
      throw new BadRequestException('No id provided');
    const relation = await this.usersService.getOneRelationship(req.user.id, id);
    if (!relation)
      return new NotFoundException('Relation not found');
    return relation;
  }

  @Get('search')
  async search(@Query('expr') expr : string) : Promise<User[]> {
    if (!expr)
      throw new BadRequestException('No expr provided');
    if (expr.includes('%'))
      throw new BadRequestException('Wildcards are forbidden');
    return await this.usersService.search(expr);
  } 

  @Post('send-friend-request')
  async sendFriendRequest(@Req() req, @Body() dto: { toId: number }) {
    if (!dto.toId)
      throw new BadRequestException('No toId provided');
    if (await this.usersService.isBlockedBy(dto.toId, req.user.id))
      throw new UnauthorizedException();
    const rel = await this.usersService.getOneRelationship(req.user.id, dto.toId);
    if (rel && (rel.type == UserRelationshipType.FRIEND || rel.type == UserRelationshipType.PENDING))
      return
    const request = await this.usersService.sendFriendRequest(req.user.id, dto.toId);
    if (!request)
      throw new UnauthorizedException();
    try {
      this.usersService.WsClients.get(dto.toId).emit("friend-request", instanceToPlain(req.user));
    } catch (error) {}
  }

  @Get('top-ten')
  async topTen() {
    return JSON.stringify(await this.usersService.topTen());
  }

  @Post('unblock-user')
  async unblockUser(@Req() req, @Body() dto: { toId: number }) {
    if (!dto.toId)
      throw new BadRequestException('No toId provided');
    try {
      await this.usersService.unblockUser(req.user.id, dto.toId);
    } catch (error) {
      throw new UnauthorizedException('User is not blocked');
    }
  }

  @Post('update-nickname')
  async updateNickname(@Req() req, @Body() dto: UpdateNicknameDto) {
    try {
      await this.usersService.updateNickname(req.user.id, dto.nickname);
      this.usersService.WsClients.get(req.user.id).emit('update_user', req.user.id);
    } catch (error) {
      if (error.code === PostgresError.PG_UNIQUE_VIOLATION)
        throw new ConflictException('Nickname already taken');
      throw new ServiceUnavailableException();
    }
  }

  @Post('update-avatar')
  @UseInterceptors(FileInterceptor('file', { fileFilter: imageFilter }))
  async updateAvatar(@Req() req : any, @UploadedFile() file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException('No file uploaded');
    const user = await this.usersService.findOne(req.user.id);
    if (!user)
      throw new NotFoundException('User not found');
    let buffer = await sharp(file.buffer)
    .resize(400, 400).toFormat('jpeg').jpeg({ quality: 90 }).toBuffer();
    await this.usersService.updateAvatar(user.id, buffer);
    this.usersService.WsClients.get(user.id).emit('update_user', user.id);
  }
}
