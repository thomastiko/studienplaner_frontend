import { createRouter, createWebHistory } from 'vue-router'
import { trackRouter } from "vue-gtag-next";
import HomePage from '../views/HomePage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    }
  ]
})
trackRouter(router);
export default router
