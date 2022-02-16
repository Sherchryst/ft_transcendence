import { createRouter, createWebHashHistory, RouteRecordRaw, useRoute } from 'vue-router'
import Base from '@/views/Base.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Chat from '@/views/Chat.vue'
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
      path: 'chat',
      name: 'chat',
      component: Chat
    },
    ]
  },
  {
    path: "/42",
    component: Home,
    beforeEnter() {
      window.location.href = "http://localhost:3000/auth/login42";
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router