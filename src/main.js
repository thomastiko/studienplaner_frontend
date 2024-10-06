import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar, Notify } from 'quasar';
import { useUserStore } from '@/stores/user.store'; // Importiere den Store
import VueGtag from "vue-gtag-next";
import './assets/styles/styles.css';

// Import icon libraries
import '@quasar/extras/roboto-font/roboto-font.css';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css';
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css';

// Import Quasar css
import 'quasar/src/css/index.sass';

import QCalendar from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/dist/index.css'

import App from './App.vue';
import router from './router';

import setupI18n from './i18n';

async function startApp() {
  const i18n = await setupI18n();
  
  const app = createApp(App);

  app.use(Quasar, {
    plugins: {
      Notify
    },
  });

  app.use(VueGtag, {
    property: {
      id: "G-P5H4J82V08"
    },
    router
  });

  app.use(i18n);
  
  const pinia = createPinia();
  app.use(pinia);
  app.use(QCalendar)

  const userStore = useUserStore(); // Initialisiere den User-Store
  await userStore.checkAuthState(router); // Überprüfe den Auth-Status beim Laden der App

  app.use(router);
  app.mount('#app');
}

startApp();
