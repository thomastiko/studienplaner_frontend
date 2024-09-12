import { createRouter, createWebHistory } from 'vue-router'
import { trackRouter } from "vue-gtag-next";
import SurveyPage from '../views/SurveyPage.vue';
import StartingPage from '../views/StartingPage.vue';
import ResultPage from '../views/ResultPage.vue';
import ResultDetailPage from '../views/ResultDetailPage.vue';
import SbwlsListPage from '../views/SbwlsListPage.vue';
import { useSurveyStore } from '@/stores/survey.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: StartingPage
    },
    {
      path: '/results',
      name: 'results',
      component: ResultPage
    },
    {
      path: '/question/:id',
      name: 'question',
      component: SurveyPage
    },
    {
      path: '/sbwls',
      name: 'SBWLs',
      component: SbwlsListPage
    },
    {
      path: '/sbwl/:name',
      name: 'SBWLDetail',
      component: ResultDetailPage,
      props: true
    }
  ]
})

router.beforeResolve(async (to, from, next) => {
  if (to.name === 'results') {
    const surveyStore = useSurveyStore()
    const userResult = surveyStore.userResult

    // Überprüfen, ob User-Ergebnisse vorhanden sind
    if (userResult.length === 0) {
      console.log('No user results, redirecting to home')
      return next({ name: 'home' })
    }
  }

  next()
})

trackRouter(router);
export default router
