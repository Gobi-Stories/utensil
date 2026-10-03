// The layer order must load before any other CSS
import 'utensil-vue/utensil-layers.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
