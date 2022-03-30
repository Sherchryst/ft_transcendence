export interface Profile {
	achievements: [],
	friends: [],
	user: User
}

export interface User {
	id: number,
	login: string,
	mmr: number,
	nickname: string,
	role: string,
	twofa?: boolean,
	twofaSecret?: string,
	newUser: boolean
}