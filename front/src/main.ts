import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { store, key } from './store'
import { createMetaManager } from 'vue-meta'
import VueCookies from 'vue3-cookies'
// import VueSocketIO from 'vue-3-socket.io'
// import io from "socket.io-client"

// export const SocketInstance = new io("http://localhost:3001");

createApp(App)
	.use(store, key)
	.use(router)
	.use(createMetaManager())
	.use(VueCookies)
	// .use(new VueSocketIO({
	// 	debug: true,
	// 	connection: 'http://localhost:3001'
	// }))
	.mount('#app')
