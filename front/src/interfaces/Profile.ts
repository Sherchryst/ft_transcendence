export enum Statut {
	NOTLOGIN,
	TWOFA,
	AUTH
  }

export interface Status{
	message: string,
	status: string,
	userId: number
}

export interface Achievement {
	id: number;
	name: string;
	description: string;
	unlocked_at: string;
}
export interface Profile {
	achievements: [],
	friends: User [],
	user: User
}

export interface User {
	xp: number;
	id: number,
	login: string,
	mmr: number,
	nickname: string,
	role: string,
	twofa?: boolean,
	twofaSecret?: string,
	newUser: boolean,
	avatarPath: string,
	status: string,
	message: string
}
