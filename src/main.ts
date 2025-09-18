import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

import './style.css';
import App from './App.vue';

const pinia = createPinia();
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
})
const app = createApp(App);


app.use(pinia);
app.use(vuetify);
app.mount('#app');
