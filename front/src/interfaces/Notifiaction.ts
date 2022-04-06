import { Channel } from "./Channel"
import { User } from "./Profile"

export interface FriendRequest {
	from: string
}

export interface ChannelInvitation {
	from: User,
	channel: Channel
}

export interface GameInvitation {
	from: User,
	map: string
}
export interface Notification {
	container: string,
	content: FriendRequest | ChannelInvitation | GameInvitation,
	date: Date
}