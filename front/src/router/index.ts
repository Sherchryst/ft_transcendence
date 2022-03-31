import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Base from '@/views/Base.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import BaseChat from '@/views/BaseChat.vue'
import Chat from '@/views/Chat.vue'
import UniqueChat from '@/views/UniqueChat.vue'
import ListChat from '@/views/ListChat.vue'
import Profile from '@/views/Profile.vue'
import Register from '@/views/Register.vue'
import GameChoice from '@/views/GameChoice.vue'
import EditProfile from '@/views/EditProfile.vue'
import Game from '@/views/Game.vue'
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const routes: Array<RouteRecordRaw> = [

  {
    path: '/',
    name: 'base',
    component: Base,
    children: [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
      path: 'game-choice',
      name: 'game-choice',
      component: GameChoice
    },
    {
      path: 'chat',
      name: 'chat-wrapper',
      component: BaseChat,
      children: [
        {
          path: '',
          name: 'chat',
          component: Chat,
        },
        {
          path: ':id',
          name: 'unique-chat',
          component: UniqueChat,
          props: true,
        },
      ]
    },
    {
      path: 'channel',
      name: 'channel',
      component: ListChat
    },
    {
      path: 'profile/view/:username',
      name: 'profile',
      props: true,
      component: Profile
    },
    {
        path: 'profile/edit',
        name: 'profile-edit',
        component: EditProfile,
    },
    {
      path: "game/:match_id",
      name: "game",
      props: true,
      component: Game
    }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
	path: '/register',
	name: 'register',
	component: Register
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, form, next) => {
  // console.log("STORE", store.getters)
  if (to.name != 'login' && !cookies.isKey('jwt'))
    next({ name: 'login' })
  else if (to.name != 'register' && cookies.isKey('jwt') && localStorage.getItem('user')) {
    const profile = JSON.parse(localStorage.getItem('user') || '' )
    if (profile?.user?.newUser)
      next({ name: 'register'})
    else
      next()
  }
  else {
      next()
  }
})

export default router
