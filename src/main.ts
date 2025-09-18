import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles' // 🎨 глобальные стили Vuetify
import { aliases, mdi } from 'vuetify/iconsets/mdi' // иконки Material Design
import '@mdi/font/css/materialdesignicons.css' // CSS для иконок

import './style.css';
import App from './App.vue';

const pinia = createPinia();
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
})
const app = createApp(App);


app.use(pinia);
app.use(vuetify);
app.mount('#app');
