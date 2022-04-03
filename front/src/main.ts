import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { store, key } from './store'
import { createMetaManager } from 'vue-meta'
import VueCookies from 'vue3-cookies'
import Toast, { PluginOptions, POSITION } from "vue-toastification";
import VueAxios from 'vue-axios';
import { API } from '@/scripts/auth';

import 'vue-toastification/dist/index.css';

const optionsToast: PluginOptions = {
    position: POSITION.TOP_CENTER
};

createApp(App)
	.use(store, key)
	.use(router)
	.use(createMetaManager())
	.use(VueCookies)
	.use(VueAxios, API)
	.use(Toast, optionsToast)
	.mount('#app')
