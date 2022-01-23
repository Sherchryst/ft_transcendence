import { IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly  accessToken: string;

  @IsNotEmpty()
  readonly refreshToken: string;
}
