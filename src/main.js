import { createApp } from 'vue'
import App from './App.vue'
import router from './config/router'
import store from './config/store/store'

import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
loadFonts()
import "bootstrap"
import './css/index.css'

import DoUiSpinner from './components/ui/DoUiSpinner.vue'
import DoUiSubHeader from './components/ui/DoUiSubHeader.vue'

createApp(App)
	.use(router)
	.use(store)
	.use(vuetify)
	.component('DoUiSpinner', DoUiSpinner)
	.component('DoUiSubHeader', DoUiSubHeader)
	.mount('#app')
// /* eslint-disable-next-line */
// if(store.getters.getApp) import('./config/eruda').then(({ default: eruda }) => {})
