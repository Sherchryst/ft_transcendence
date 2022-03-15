import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import axios from 'axios';

// define your typings for the store state
export interface State {
  profile: {user: unknown, friends: unknown[], achievements: unknown[]}
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
	profile: {user: 0, friends: [], achievements: []}
  },
  mutations: {
	connect() {
		axios.get('http://localhost:3000/users/get-profile').then((res) => {
		this.profile = res.data;
		console.log("hop", this.profile)
	})
	}
  },
  actions: {
  },
  modules: {
  }
})
