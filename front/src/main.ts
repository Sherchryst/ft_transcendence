import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { store, key } from './store'
import { createMetaManager } from 'vue-meta'
import VueCookies from 'vue3-cookies'

createApp(App)
	.use(store, key)
	.use(router)
	.use(createMetaManager())
	.use(VueCookies)
	// .use(new VueSocketIO({
	// 	debug: true,
	// 	connection: socket,
	// 	vuex: {
	// 		store,
	// 		actionPrefix: "SOCKET_",
	// 		mutationPrefix: "SOCKET_"
	// 	}
	// }))
	.mount('#app')
