import { createRouter, createWebHistory } from "vue-router";
import { trackRouter } from "vue-gtag-next";
import { useUserStore } from '@/stores/user.store';
import HomePage from "../views/HomePage.vue";
import Login from "@/components/login.vue";
import Register from "@/components/register.vue";
import MyStudy from "../views/MyStudy.vue";
import Studies from "../views/Studies.vue";
import StudyPlan from "../views/StudyPlan.vue";
import LvPlaner from "../views/LvPlaner.vue"
import Profcheck from "../views/Profcheck.vue"
import ProfessorPage from "../views/ProfessorPage.vue"
import RateProfessor from "../views/RateProfessor.vue"
import AddLv from "../views/AddLv.vue"
import AdminPanel from "../views/AdminPanel.vue"
import ManageCommentary from "../views/ManageCommentary.vue"
import FetchLvs from "../views/FetchLvs.vue"

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
      path: "/my-study/:study_id",
      name: "Studyplan",
      component: StudyPlan,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/lvplaner",
      name: "LvPlaner",
      component: LvPlaner,
      meta: { requiresAuth: true },
    },
    {
      path: "/addlv",
      name: "AddLv",
      component: AddLv,
      meta: { requiresAuth: true },
    },
    {
      path: "/profcheck",
      name: "Profcheck",
      component: Profcheck,
      meta: { requiresAuth: false },
    },
    {
      path: "/profcheck/:prof_id",
      name: "ProfessorPage",
      component: ProfessorPage,
      meta: { requiresAuth: false },
    },
    {
      path: "/rateprofessor/:prof_id",
      name: "RateProfessor",
      component: RateProfessor,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin-panel",
      name: "AdminPanel",
      component: AdminPanel,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin-panel/manage-commentary",
      name: "ManageCommentary",
      component: ManageCommentary,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin-panel/fetch-lvs",
      name: "FetchLvs",
      component: FetchLvs,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
});


// Router-Guard für geschützte Routen
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const userStore = useUserStore(); // Pinia Store für Benutzerdaten

  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    // Wenn die Route Authentifizierung erfordert und kein Token vorhanden ist
    next('/login');
  } else if (to.matched.some(record => record.meta.requiresAdmin)) {
    // Wenn die Route Admin-Rechte erfordert
    if (userStore.loggedIn && userStore.user.role === 'admin') {
      next();
    } else {
      next('/'); // Zum Beispiel zur Homepage weiterleiten, falls kein Zugriff
    }
  } else {
    next();
  }
});


// Analysiere den Router
trackRouter(router);

export default router;
