import { createApp } from 'vue'
import App from './App.vue'
import i18n from '@src/i18n';
import '@src/styles/index.css'

createApp(App).use(i18n).mount('#app')
