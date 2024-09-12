<template>
  <div>
    <div>
      <ProgressBar :questions="questions" :currentQuestionIndex="currentQuestionIndex" />
    </div>
    <div class="q-pa-md">
      <q-btn @click="prevQuestion" flat text-color="deep-orange" :disabled="currentQuestionIndex <= 0" icon="arrow_back">
        <q-tooltip>
          {{ $t('survey.previous_question') }}
        </q-tooltip>
      </q-btn>
      <Survey ref="survey" :questions="questions" :currentQuestionIndex="currentQuestionIndex" :booster="booster"
        @answer="handleAnswer" @study="addStudy" @skip="addQuestionIndex" @booster-status="changeBooster" />
    </div>

  <!-- Dialog for Instructions -->
  <q-dialog v-model="instruction" persistent>
      <q-card>
        <q-card-section>
          <div  class="text-h6" style="font-weight: 400" v-html="$t('survey.instruction_one')"></div>
        </q-card-section>
        <q-card-section class="q-pt-sm">
          <div class="text-body1 q-mb-md">
          <span style="font-weight: bold;">1.</span> {{$t('survey.instruction_two')}}
          </div>
          <div class="text-body1">
          <span style="font-weight: bold;">2.</span> {{$t('survey.instruction_three')}}
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-center" style="font-weight: 400"> {{$t('survey.much_fun')}}! </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('survey.understood')" color="deep-orange" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div> 
</template>

<script>
import { ref } from 'vue'
import Survey from '../components/Survey.vue'
import ProgressBar from '../components/ProgressBar.vue'
import { useSurveyStore } from '@/stores/survey.store'
import { useRoute } from 'vue-router'
import { useCourseStore } from '@/stores/course.store'

export default {
  setup() {
    const route = useRoute()
    const surveyStore = useSurveyStore()
    const courseStore = useCourseStore()
    const currentQuestionIndex = ref(route.params.id ? parseInt(route.params.id) - 1 : 0)


    const getQuestions = () => {
      return Array.from({ length: 35 }, (_, i) => ({
        id: i+1,
        text: `questions.question_${i+1}`,
        type: 'content'
      }));
    };
    const questionsData = ref(getQuestions());
    // Reset currentQuestionIndex to 0 when the component is created
    const resetQuestionIndex = () => {
      currentQuestionIndex.value = 0
    }

    // Call resetQuestionIndex when the component is created
    resetQuestionIndex()

    return {
      surveyStore,
      courseStore,
      currentQuestionIndex,
      questions: questionsData,
      booster: ref(false),
      instruction: ref(true),
    }
  },
  components: {
    Survey,
    ProgressBar
  },
  data() {
    return {}
  },
  methods: {
    handleAnswer(question) {
      this.updateQuestionIndex(question);
    },
    addStudy(study) {
      this.surveyStore.addStudies(study)
    },
    updateQuestionIndex(question) {
      const existingQuestion = this.surveyStore.userResult.find(
        (item) => item.question === question.question
      )
      if (existingQuestion) {
        if (
          existingQuestion.answer !== question.answer ||
          existingQuestion.weight !== question.weight
        ) {
          existingQuestion.answer = question.answer
          existingQuestion.weight = question.weight
        }
      } else {
        this.surveyStore.addAnswer(question)
      }

      if (this.currentQuestionIndex <= this.questions.length - 1) {
        this.currentQuestionIndex++
        this.$router.push({ name: 'question', params: { id: this.currentQuestionIndex + 1 } })
      } else {
        this.currentQuestionIndex = this.questions.length
      }
      this.booster = false;
    },
    addQuestionIndex() {
      this.currentQuestionIndex++
      if (this.currentQuestionIndex < this.questions.length) {
        this.$router.push({ name: 'question', params: { id: this.currentQuestionIndex + 1 } });
      } else {
        // Wenn es keine nächste Frage gibt, navigiere zum Ergebnis
        this.$router.push({ name: 'results' });
      }
    },
    prevQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--
        this.$router.push({ name: 'question', params: { id: this.currentQuestionIndex + 1 } });
      }
    },
    changeBooster(boosterStatus) {
      this.booster = boosterStatus
    }
  },
  watch: {
    currentQuestionIndex: {
      handler() {
        if (this.currentQuestionIndex == this.questions.length) {
          this.$router.push({ name: 'results' })
        }
      },
      deep: true
    }
  },
  async mounted() {

  },
  updated() {
    const route = useRoute()
    const index = route.params.id ? parseInt(route.params.id) - 1 : 0
    this.currentQuestionIndex = index
  }
}
</script>

<style></style>
