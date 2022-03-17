export interface Profile {
	achivements?: [],
	friends?: [],
	user: User
}

export interface User {
	id: number,
	login: string,
	mmr: number,
	nickname: string,
	role: string,
	twofa?: boolean,
	twofaSecret?: string
}