import { User } from "./Profile";

export interface Channel{
	id: number,
	name: string,
	owner?: User,
	visibility: number,
	password: string | null
}

export interface ChannelMember_t{
	id: number,
	nickname: string,
	role: ChannelMemberRole
}

export interface Member_t {
	last_read_at: Date,
	role: string,
	user: User
}

export enum ChannelMemberRole {
	ADMIN = 'admin',
	MEMBER = 'member'
}