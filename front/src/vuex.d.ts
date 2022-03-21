import { Store } from 'vuex'

declare module '@vue/runtime-core' {
	// declare your own store states
	interface State {
		profile: Profile,
		user: User,
		login: string,
		socket: WebSocket | undefined
	}

	// provide typings for `this.$store`
	interface ComponentCustomProperties {
		$store: Store<State>
	}
}
