import { Channel } from "./Channel"
import { User } from "./Profile"

export interface FriendRequest {
	nickname: string,
	id: number
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