import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/vue3-2048-game/',
  resolve: {
    alias: {
      '@src': resolve(__dirname, './src')
    }
  },
  plugins: [vue()]
})
