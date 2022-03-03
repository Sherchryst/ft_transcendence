import { createRouter, createWebHashHistory, RouteRecordRaw, useRoute } from 'vue-router'
import Home from '@/views/Home.vue'
import Chat from '@/views/Chat.vue'
import Game from '@/views/Game.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: "/42",
    component: Home,
    beforeEnter() {
      window.location.href = "http://localhost:3000/auth/login42";
    }
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat
  },
  {
    path: "/game",
    name: "Game",
    component: Game
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router