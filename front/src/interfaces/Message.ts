import { User } from "./Profile"

export interface Message_t {
	from: String,
	content: String
	self?: boolean
}

export interface ServerMessage {
	from: User,
	content: String
}