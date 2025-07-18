/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import type { App } from 'vue'
import vuetify from './vuetify'
import router from '../router' // ИСПРАВЛЕНО: импорт готового роутера

export function registerPlugins(app: App) {
  app
    .use(vuetify)
    .use(router)
}