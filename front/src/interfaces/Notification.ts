import { Channel } from "./Channel"
import { GameMap } from "./game/gameMap.interface"
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
    from: User;
    to: User;
    map: GameMap;
    sentAt: Date;
    level: number;
}

export interface GameStart {
	id: string
}

export interface Notification {
	container: string,
	content: FriendRequest | ChannelInvitation | GameInvitation | GameStart,
	date: Date
}