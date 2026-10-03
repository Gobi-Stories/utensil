// Utensil layer order must load before any CSS that mentions the layers
import 'utensil-vue/utensil-layers.css'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
