import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
//import 'bootstrap-icons/font/bootstrap-icons.css';

import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')