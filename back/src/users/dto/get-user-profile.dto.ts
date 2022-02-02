import { IsNotEmpty } from 'class-validator';

export class GetUserProfileDto {
	@IsNotEmpty()
	readonly userId: number;
}
