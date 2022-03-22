import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import { API } from '@/scripts/auth.ts';
import { Profile, User } from '@/interfaces/Profile';

// define your typings for the store state
export interface State {
  profile: Profile,
  socket: WebSocket | undefined,
  chatMessages: string[]
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    profile: {user: {} as User, friends: [], achievements: []},
    socket: undefined,
    chatMessages: []
  },
  getters: {
    displayMessages(state) {
      return state.chatMessages
    },
    getChatSocket(state) {
      return state.socket;
    },
    getLogin(state) : string{
      return state.profile.user.login
    },
    getNickname(state) : string{
      return state.profile.user.nickname
    }
  },
  mutations: {
    setProfile(state, _profile) {
      state.profile = _profile
    },
    ADD_MESSAGE(state, message) {
      state.chatMessages.push(message);
    },
      DELETE_MESSAGE(state, message) {
		state.chatMessages = state.chatMessages.filter(m => m.id !== message.id);
      }
  },
  actions: {
    connection({commit}){
      return API.get('users/profile')
        .then((response) => {
          commit("setProfile", response.data)
        })
    },
    addMessage({ commit }, message) {
      commit('ADD_MESSAGE', message);
    },
    deleteMessage({ commit }, message) {
      commit('DELETE_MESSAGE', message);
    }
  },
  modules: {
  }
})
