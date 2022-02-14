import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './index.css'
import store from './store'

<<<<<<< HEAD
createApp(App).use(router).mount('#app')
axios.defaults.withCredentials = true
localStorage.setItem("state", "0")
=======

createApp(App).use(store).use(router).mount('#app')
axios.defaults.withCredentials = true
>>>>>>> acae2e22ba2a3a1bbaf979c0ba4102e7d2da2c8c
