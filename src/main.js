// import './assets/main.css'
import 'bulma/css/bulma.css'
import './assets/main.css'
import 'leaflet/dist/leaflet.css';
import 'sweetalert2/dist/sweetalert2.min.css';

// import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import { createPinia } from 'pinia'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia);
app.use(router)
app.mount('#app')
