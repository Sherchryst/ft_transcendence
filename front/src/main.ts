import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { store, key } from './store'
import { createMetaManager } from 'vue-meta'
import VueCookies from 'vue3-cookies'

<<<<<<< HEAD
=======

>>>>>>> main
createApp(App)
	.use(store, key)
	.use(router)
	.use(createMetaManager())
	.use(VueCookies)
<<<<<<< HEAD
	// .use(new VueSocketIO({
	// 	debug: true,
	// 	connection: socket,
	// 	vuex: {
	// 		store,
	// 		actionPrefix: "SOCKET_",
	// 		mutationPrefix: "SOCKET_"
	// 	}
	// }))
=======
>>>>>>> main
	.mount('#app')
