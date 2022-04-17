import { Channel } from "./Channel"
import { GameMap } from "./game/gameMap.interface"
import { User } from "./Profile"

export interface FriendRequest {
	from: User,
	created_at: Date;
}

export interface ChannelInvitation {
	from: User,
	channel: Channel
	sent_at: Date;
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