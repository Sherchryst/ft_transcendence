import { Channel } from "./Channel"
import { User } from "./Profile"

export interface FriendRequest {
	from: User
}

export interface ChannelInvitation {
	from: User,
	channel: Channel
}

export interface GameInvitation {
	from: User,
	map: String

}

export enum NotificationType {
	FRIEMD,
	CHANNEL,
	GAME
}
export interface Notification {
	type: NotificationType,
	content: FriendRequest | ChannelInvitation | GameInvitation,
	date: Date
}