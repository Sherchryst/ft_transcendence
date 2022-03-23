import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { store, key } from './store'
import { createMetaManager } from 'vue-meta'
import VueCookies from 'vue3-cookies'
import VueSocketIO from 'vue-3-socket.io'
import io from "socket.io-client"

createApp(App)
	.use(store, key)
	.use(router)
	.use(createMetaManager())
	.use(VueCookies)
	.use(new VueSocketIO({
		debug: true,
		connection: io("http://localhost:3001", {transports: ['websocket']}),
		vuex: {
			store,
			actionPrefix: "SOCKET_",
			mutationPrefix: "SOCKET_"
		}
	}))
	.mount('#app')
