import { createRouter, createWebHashHistory, RouteRecordRaw, useRoute } from 'vue-router'
import Home from '@/views/Home.vue'
import Redirection from '@/components/Redirection.vue'
import axios from 'axios'

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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router