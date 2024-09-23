import { createRouter, createWebHistory } from "vue-router";
import { trackRouter } from "vue-gtag-next";
import HomePage from "../views/HomePage.vue";
import Login from "@/components/login.vue";
import Register from "@/components/register.vue";
import MyStudy from "../views/MyStudy.vue";
import Studies from "../views/Studies.vue";
import StudyPlan from "../views/StudyPlan.vue";

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
    {
      path: "/my-study",
      name: "my-study",
      component: MyStudy,
      meta: { requiresAuth: true },
    },
    {
      path: "/studies",
      name: "studies",
      component: Studies,
      meta: { requiresAuth: false },
    },
    {
      path: "/plan/:id",
      name: "Studyplan",
      component: StudyPlan,
      meta: { requiresAuth: true },
      props: true,
    }
  ],
});

// Router-Guard für geschützte Routen
/*router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    // Wenn die Route Authentifizierung erfordert und kein Token vorhanden ist
    next('/login');
  } else {
    next();
  }
});*/

// Analysiere den Router
trackRouter(router);

export default router;
