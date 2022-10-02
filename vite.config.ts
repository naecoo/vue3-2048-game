import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/vue3-2048-game/',
  resolve: {
    alias: {
      '@src': resolve(__dirname, './src')
    }
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      scope: '/vue3-2048-game/',
      manifest: {
        "name": "vue3-2048-game",
        "short_name": "2048",
        "description": "2048 game by Vue.js 3.x",
        "start_url": "/vue3-2048-game/",
        "display": "standalone",
        "background_color": "#f78e48",
        "theme_color": "#f78e48",
        "prefer_related_applications": true,
        "icons": [
          {
            "src": "/vue3-2048-game/icon.svg",
            "sizes": "48x48",
            "type": "image/svg",
            "purpose": "any maskable"
          },
          {
            "src": "/vue3-2048-game/icon.svg",
            "sizes": "192x192",
            "type": "image/svg",
            "purpose": "any maskable"
          },
          {
            "src": "/vue3-2048-game/icon.svg",
            "sizes": "512x512",
            "type": "image/svg",
            "purpose": "any maskable"
          }
        ]
      }
    })
  ]
})
