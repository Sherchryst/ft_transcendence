import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import { API } from '@/scripts/auth.ts';

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
      API.get('users/get-profile')
        .then((res) => {
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
