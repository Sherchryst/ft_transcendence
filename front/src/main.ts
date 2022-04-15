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
import SDropdown from "@storinka/dropdown";

import 'vue-toastification/dist/index.css';

const optionsToast: PluginOptions = {
    position: POSITION.TOP_CENTER,
	maxToasts: 5,
};

createApp(App)
	.use(store, key)
	.use(router)
	.use(createMetaManager())
	.use(VueCookies)
	.use(VueAxios, API)
	.use(Toast, optionsToast)
	.use(SDropdown)
	.mount('#app')