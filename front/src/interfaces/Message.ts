import { Channel } from "./Channel"
import { User } from "./Profile"

export interface Message_t {
	from: string,
	content: string
	self?: boolean
}

export interface ServerMessage {
	from: User,
	content: string
}

export interface SocketMessage {
	message: ServerMessage
	channel: Channel
}