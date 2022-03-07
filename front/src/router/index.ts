import { createRouter, createWebHashHistory, RouteRecordRaw, useRoute } from 'vue-router'
import Base from '@/views/Base.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Chat from '@/views/Chat.vue'
import UniqueChat from '@/views/UniqueChat.vue'
import ListChat from '@/views/ListChat.vue'
import Profile from '@/views/Profile.vue'
import Register from '@/views/Register.vue'
import GameChoice from '@/views/GameChoice.vue'
import Redirection from '@/components/Redirection.vue'
import axios from 'axios'

const routes: Array<RouteRecordRaw> = [

  {
    path: '/',
    name: 'Base',
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
      name: 'chat',
      component: Chat,
      children: [
        
      ]
    },
    {
      path: 'chat/:id',
      name: 'unique-chat',
      component: UniqueChat,
    },
    {
      path: 'channel',
      name: 'channel',
      component: ListChat
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
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
  // {
  //   path: "/chat",
  //   name: "Chat",
  //   component: Chat
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
