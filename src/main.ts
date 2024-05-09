import 'reset.css'
import '@/css/main.css'
// eslint-disable-next-line import/no-unresolved
import 'virtual:uno.css'

import { createApp } from 'vue'
import router from './router'

import App from './App.vue'

const app = createApp(App)
app.use(router)

app.mount('#app')
