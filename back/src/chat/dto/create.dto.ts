import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ChannelVisibility } from '../entities/channel.entity';

export class CreateChannelDto {
  @IsNotEmpty()
  @MaxLength(32)
  name: string;

  @MaxLength(32)
  password: string;

  @IsNotEmpty()
  visibility: ChannelVisibility;
}
