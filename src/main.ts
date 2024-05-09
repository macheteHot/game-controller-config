import 'reset.css'
import './assets/main.css'
// eslint-disable-next-line import/no-unresolved
import 'virtual:uno.css'

import { createApp } from 'vue'
import GamePadViewerConfig from './GamePadViewerConfig.vue'

const app = createApp(GamePadViewerConfig)

app.mount('#app')
