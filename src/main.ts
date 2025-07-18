/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { registerPlugins } from './plugins'
import './styles/settings.scss'


const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
