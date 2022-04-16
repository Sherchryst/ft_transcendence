import { IsNotEmpty, MaxLength, Length } from 'class-validator';
import { ChannelVisibility } from '../entities/channel.entity';

export class CreateChannelDto {
  @IsNotEmpty()
  @Length(4, 32)
  name: string;

  @MaxLength(32)
  password: string;

  @IsNotEmpty()
  visibility: ChannelVisibility;
}
