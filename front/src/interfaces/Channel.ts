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

export enum ChannelMemberRole {
	ADMIN = 'admin',
	MEMBER = 'member'
}