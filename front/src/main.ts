import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { store, key } from './store'
import { createMetaManager } from 'vue-meta'
import VueCookies from 'vue3-cookies'
import VueSocketIO from 'vue-3-socket.io'


createApp(App)
	.use(store, key)
	.use(router)
	.use(createMetaManager())
	.use(VueCookies)
	.use(new VueSocketIO({
		debug: true,
		connection: 'ws://localhost:3001/chat',
		vuex: {
			store,
			actionPrefix: 'SOCKET_',
			mutationPrefix: 'SOCKET_'
		}
	}))
	.mount('#app')
