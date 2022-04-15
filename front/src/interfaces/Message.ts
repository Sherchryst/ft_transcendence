import { Channel, ChannelMember_t } from "./Channel"

export interface Message_t {
	from: ChannelMember_t
	content: string
	self: boolean
	photo: boolean
}

export interface ServerMessage {
	from: ChannelMember_t
	content: string
}

export interface SocketMessage {
	message: ServerMessage
	channel: Channel
}