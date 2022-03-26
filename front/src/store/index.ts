<<<<<<< HEAD
import { InjectionKey }
 from 'vue'
import { createStore, Store } from 'vuex';
import { Profile, User } from '@/interfaces/Profile';
import { io, Socket } from "socket.io-client";
import { API } from '@/scripts/auth';
// define your typings for the store state
export interface State {
  profile: Profile,
  chatMessages: string[]
=======
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import { API } from '@/scripts/auth.ts';
import { Profile, User } from '@/interfaces/Profile';

// define your typings for the store state
export interface State {
  profile: Profile,
  socket: WebSocket | undefined
>>>>>>> main
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    profile: {user: {} as User, friends: [], achievements: []},
<<<<<<< HEAD
    chatMessages: []
  },
  getters: {
    displayMessages(state) {
      return state.chatMessages
=======
    socket: undefined,
  },
  getters: {
    getChatSocket(state) {
      return state.socket;
>>>>>>> main
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
<<<<<<< HEAD
    },
    SOCKET_ADD_MESSAGE(state, message) {
      state.chatMessages.push(message);
    }
  },
  actions: {
    async connection({commit}){
      const response = await API.get('users/profile');
       commit("setProfile", response.data);
    },
    SOCKET_addMessage({ commit }, message) {
      commit('ADD_MESSAGE', message);
    },
    SOCKET_deleteMessage({ commit }, message) {
      commit('DELETE_MESSAGE', message);
=======
    }
  },
  actions: {
    connection({commit}){
      return API.get('users/profile')
        .then((response) => {
          commit("setProfile", response.data)
        })
>>>>>>> main
    }
  },
  modules: {
  }
})
