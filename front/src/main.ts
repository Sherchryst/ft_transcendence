import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './index.css'
import store from './store'
import { createMetaManager } from 'vue-meta'


createApp(App)
	.use(store)
	.use(router)
	.use(createMetaManager())
	.mount('#app')
axios.defaults.withCredentials = true
