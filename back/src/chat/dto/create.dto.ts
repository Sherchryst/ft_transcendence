import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ChannelVisibility } from '../entities/channel.entity';

export class CreateChannelDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(32)
  name: string;

  @MinLength(4)
  @MaxLength(32)
  password: string;

  @IsNotEmpty()
  visibility: ChannelVisibility;
}
