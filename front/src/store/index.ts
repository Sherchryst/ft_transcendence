import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex';
import { Profile, User } from '@/interfaces/Profile';
import { API } from '@/scripts/auth';
import { Statut, Status } from '@/interfaces/Profile';
// define your typings for the store state
export interface State {
  profile: Profile,
  chatMessages: string[]
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    profile: {user: {} as User, friends: [] as User[], achievements: []},
    chatMessages: []
  },
  getters: {
    displayMessages(state) {
      return state.chatMessages
    },
    getLogin() : string{
      const profile : Profile = JSON.parse(localStorage.getItem('user') || '{}')
      return profile?.user?.login
    },
    getAvatarPath() : string{
      const profile : Profile = JSON.parse(localStorage.getItem('user') || '{}')
      return profile?.user?.avatarPath
    },
    getNickname() : string{
      const profile : Profile = JSON.parse(localStorage.getItem('user') || '{}')
      return profile?.user?.nickname
    },
    getId() : number{
      const profile : Profile = JSON.parse(localStorage.getItem('user') || '{}')
      return profile?.user?.id
    },
    isNewUser(): boolean {
      const profile : Profile = JSON.parse(localStorage.getItem('user') || '{}')
      return profile?.user?.newUser
    },
    is2FA(): boolean | undefined {
      const profile : Profile = JSON.parse(localStorage.getItem('user') || '{}')
      return profile?.user?.twofa;
    },
    getFriends() : User[]{
      const profile : Profile = JSON.parse(localStorage.getItem('user') || '{}')
      return profile?.friends
    }
  },
  mutations: {
    updateProfilePicture(state, _profile: Profile) {
      const profile : Profile = JSON.parse(localStorage.getItem('user') || '{}');
      profile.user.avatarPath = _profile.user.avatarPath;
      console.log(profile.user.avatarPath)
      localStorage.setItem('user', JSON.stringify(profile));
    },
    updateStatus(state, status: Status) {
        const profile : Profile = JSON.parse(localStorage.getItem('user') || '{}')
        const id : number = profile.friends.findIndex(friend => friend.id === status.userId)
      if (id != -1) {
        profile.friends[id].status = status.status
        profile.friends[id].message = status.message
        localStorage.setItem('user', JSON.stringify(profile))
      }
    },
    setProfile(state, _profile) {
      localStorage.setItem("state", Statut.AUTH.toString())
      localStorage.setItem('user', JSON.stringify(_profile))
      //state.profile = _profile
    },
    SOCKET_ADD_MESSAGE(state, message) {
      state.chatMessages.push(message);
    }
  },
  actions: {
    async updateProfilePicture({ commit }) {
      const response = await API.get('users/profile');
      commit("updateProfilePicture", response.data);
    },
    setStatus({commit}, status: Status) {
      commit('updateStatus', status)
    },
    async connection({commit}){
        const response = await API.get('users/profile');
        commit("setProfile", response.data);
    },
    SOCKET_addMessage({ commit }, message) {
      commit('ADD_MESSAGE', message);
    },
    SOCKET_deleteMessage({ commit }, message) {
      commit('DELETE_MESSAGE', message);
    }
  },
  modules: {
  }
})
