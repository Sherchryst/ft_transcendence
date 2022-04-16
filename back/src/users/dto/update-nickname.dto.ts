import { IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class UpdateNicknameDto {
  @IsNotEmpty()
  @MaxLength(10)
  @Matches('^[a-zA-Z0-9\-_]+$', '',
  { message: 'nickname can contain only alphanumeric characters, dashes and underscores' })
  nickname: string;
}
