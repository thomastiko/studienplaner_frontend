import { createRouter, createWebHistory } from "vue-router";
import { trackRouter } from "vue-gtag-next";
import HomePage from "../views/HomePage.vue";
import Login from "@/components/login.vue";
import Register from "@/components/register.vue";

// Erstelle den Router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { requiresAuth: false },
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: { requiresAuth: false },
    },
  ],
});

// Router-Guard für geschützte Routen
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    // Wenn die Route Authentifizierung erfordert und kein Token vorhanden ist
    next('/login');
  } else {
    next();
  }
});

// Analysiere den Router
trackRouter(router);

export default router;
