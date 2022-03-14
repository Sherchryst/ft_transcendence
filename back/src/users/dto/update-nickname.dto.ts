import { IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class UpdateNicknameDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @MaxLength(32)
  @Matches('^(?!anon-).*$', '', { message: 'nickname cannot start with "anon-"' })
  @Matches('^[a-zA-Z0-9\-_]+$', '',
  { message: 'nickname can contain only alphanumeric characters, dashes and underscores' })
  nickname: string;
}
