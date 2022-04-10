import { Channel } from "./Channel"
import { User } from "./Profile"

export interface Message_t {
	from: User
	content: string
	self: boolean
	photo: boolean
}

export interface ServerMessage {
	from: User
	content: string
}

export interface SocketMessage {
	message: ServerMessage
	channel: Channel
}