import { User } from "./Profile";

export interface Channel{
	id: number,
	name: string,
	owner?: User,
	visibility: number,
	password: string | null,
	isPasswordSet: boolean	
}

export interface ChannelMember_t{
	id: number,
	nickname: string,
	role: ChannelMemberRole
}

export interface Member_t {
	channel: Channel,
	user: User
	role: ChannelMemberRole,
	last_read_at: Date,
}

export enum ChannelMemberRole {
	ADMIN = 'admin',
	MEMBER = 'member'
}