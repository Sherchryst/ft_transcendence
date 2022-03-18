import { createRouter, createWebHashHistory, RouteRecordRaw, useRoute } from 'vue-router'
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
import Redirection from '@/components/Redirection.vue'
import Game from '@/views/Game.vue'

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
      path: 'profile/:username',
      name: 'profile',
      props: true,
      component: Profile
    },
    {
      path: "game",
      name: "game",
      component: Game
    }
    ]
  },
  {
    path: "/42",
    name: 'ft-api',
    component: Home,
    beforeEnter() {
      window.location.href = "http://localhost:3000/auth/login42";
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
	path: '/register',
	name: 'Register',
	component: Register
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// router.beforeEach((to, form, next) => {
//   if (to.name != 'login' && !isAuthenticated)
// })

export default router
