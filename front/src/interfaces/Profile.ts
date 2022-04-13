export enum Statut {
	NOTLOGIN,
	TWOFA,
	AUTH
  }

export interface Achievement {
	id: number;
	name: string;
	description: string;
	unlocked_at: string;
}
export interface Profile {
	achievements: [],
	friends: [],
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
	avatarPath: string
}
