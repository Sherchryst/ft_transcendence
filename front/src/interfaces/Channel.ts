import { User } from "./Profile";

export interface Channel{
	id: number,
	name: string,
	owner?: User,
	visibility: number,
	password: string | null
}

import { InjectionKey, } from 'vue';

export const ChannelKey: InjectionKey<Channel> = Symbol('Channel');