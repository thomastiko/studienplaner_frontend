<template>
  <div>
    <div class="q-pa-md">
    <q-btn
      @click="goBack"
      flat
      text-color="deep-orange"
      icon="arrow_back"
    />
    </div>
    <div class="row justify-center">
      <div class="col-12 text-center q-mb-sm">
        <div class="text-h4 text-orange-8 text-uppercase text-bold">{{ this.findSbwl.name }}</div>
      </div>
      <div class="col-12 text-center q-mb-xl">
        <div class="text-h6 text-orange-8 text-bold">{{ $t('resultdetailpage.detail') }}</div>
      </div>
      <div class="col-12 row col-md-8 bg-orange-8 rounded-borders q-pa-md">
        <div class="col-12 q-mb-md">
          <q-icon name="info" color="white" size="lg" />
        </div>
        <div class="col-12">
          <div class="text-body1 text-white">
            {{ sbwlInfoText }}
          </div>
        </div>
      </div>
    </div>
    <div id="further-info" class="row justify-center q-mt-xl">
      <div class="col-12 text-center text-h6 q-mb-lg">
        {{ $t('resultdetailpage.further_info') }}:
      </div>
      <div class="col-12 col-md-8 row justify-center text-h6 text-bold text-orange-8">
        <div class="q-pa-md">Einstiegsliste AG WU</div>
        <div class="q-pa-md">
          <a :href="this.findSbwl.website_links[1]?.link" class="sbwl-link" target="_blank"
            >Institute Website</a
          >
        </div>
        <div class="q-pa-md">
          <a :href="this.findSbwl.website_links[0]?.link" class="sbwl-link" target="_blank"
            >ÖH Spezialisierung-Präsentation</a
          >
        </div>
      </div>
    </div>
    <div class="row q-pa-md q-col-gutter-md justify-center q-mt-md">
      <div class="col-12 col-md-6" v-for="(opinion, i) in studentOpinions" :key="i">
        <q-card flat bordered>
          <q-item>
            <q-item-section avatar>
              <q-avatar color="orange-8" text-color="white">
                {{ opinion.initial }}
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label> {{ opinion.student }} </q-item-label>
              <q-item-label caption>
                <q-rating size="18px" v-model="opinion.rating" icon-half="star_half" :max="5" color="orange-8" readonly />
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-card-section class="text-body1">
            {{ opinion.text }}
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-if="this.surveyStore.userResult.length > 0">
      <q-separator class="q-mt-lg q-mb-xl" inset color="orange-8" />
      <div class="row q-ma-md q-mb-xl">
        <div class="col-12 text-orange-8 text-h4 text-bold q-mb-lg">
          {{ $t('resultdetailpage.answers_compared') }}
        </div>
        <div class="col-12 text-body1">
          {{ $t('resultdetailpage.answers_compared_info_text') }}
        </div>
      </div>
      <div class="row q-ma-md">
        <div
          class="col-12 row q-mb-lg"
          v-for="(questionData, index) in sortedQuestions"
          :key="index"
        >
          <div class="col-12">
            <div class="col-12 text-h6 text-bold q-mb-md">
              {{ questionData.questionText }}
              <span class="text-body1 text-yellow-8" v-if="isBoosted(questionData.id)">
                <q-icon name="star" size="sm" color="yellow-8" />
                {{ $t('resultdetailpage.double-weighted') }}
              </span>
            </div>
            <div class="col-12 text-body1">
              <div>
                {{ $t('resultdetailpage.your_answer') }}: {{ getUserAnswer(questionData.id) }}
              </div>
              <div>
                {{ $t('resultdetailpage.sbwl_answer') }}: {{ getSbwlAnswer(questionData.id) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import questions from '@/stores/questions.json'
import { useSurveyStore } from '@/stores/survey.store'
import useSbwls from '@/stores/sbwls.json'

export default {
  setup() {
    const questionsData = ref(questions)
    const surveyStore = useSurveyStore()
    const sbwls = ref(useSbwls)

    return {
      questions: questionsData,
      surveyStore,
      sbwls,
      stars: ref(4)
    }
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  methods: {
    getUserAnswer(questionId) {
      const answer = this.surveyStore.userResult.find((result) => result.id === questionId)
      return answer ? answer.weight : '-'
    },
    getSbwlAnswer(questionId) {
      const sbwlEvaluation = this.findSbwl.evaluation.find(
        (evaluation) => evaluation.id === questionId
      )
      return sbwlEvaluation ? sbwlEvaluation.answer : 'N/A'
    },
    isBoosted(questionId) {
      const answer = this.surveyStore.userResult.find((result) => result.id === questionId)
      return answer ? answer.boost : false
    },
    goBack() {
      this.$router.go(-1)
    }
  },
  computed: {
    findSbwl() {
      const sbwl = this.sbwls.find((study) => study.name === this.name)
      return sbwl
    },
    studentOpinions() {
      const formattedName = this.name.replace(/\s+/g, '_')

      const student1Key = `opinions.${formattedName}.student_name_1`
      const opinion1Key = `opinions.${formattedName}.student_opinion_1`
      const rating1Key = `opinions.${formattedName}.rating_1`

      const student2Key = `opinions.${formattedName}.student_name_2`
      const opinion2Key = `opinions.${formattedName}.student_opinion_2`
      const rating2Key = `opinions.${formattedName}.rating_2`

      const student3Key = `opinions.${formattedName}.student_name_3`
      const opinion3Key = `opinions.${formattedName}.student_opinion_3`
      const rating3Key = `opinions.${formattedName}.rating_3`

      const student1 = this.$t(student1Key)
      const opinion1 = this.$t(opinion1Key)
      const rating1 = parseFloat(this.$t(rating1Key))

      const student2 = this.$t(student2Key)
      const opinion2 = this.$t(opinion2Key)
      const rating2 = parseFloat(this.$t(rating2Key))

      const student3 = this.$t(student3Key)
      const opinion3 = this.$t(opinion3Key)
      const rating3 = parseFloat(this.$t(rating3Key))

      const opinions = []

      if (opinion1) {
        opinions.push({ id: 1, text: opinion1, student: student1, rating: rating1, initial: student1.charAt(0)})
        console.log(opinions)
      }

      if (opinion2) {
        opinions.push({ id: 2, text: opinion2, student: student2, rating: rating2, initial: student2.charAt(0)})
      }
      if (opinion3) {
        opinions.push({ id: 3, text: opinion3, student: student3, rating: rating3, initial: student3.charAt(0)})
      }

      return opinions
    },
    sbwlInfoText() {
      const formattedName = this.name.replace(/\s+/g, '_')
      const infoKey = `opinions.${formattedName}.information_text`
      return this.$t(infoKey)
    },
    sortedQuestions() {
      const questionsWithDifferences = []

      // Iteriere über die Anzahl der Fragen im questions.json-File
      for (let i = 2; i <= Object.keys(questions).length; i++) {
        const questionKey = `question_${i}`
        const questionText = this.$t(`questions.${questionKey}`)
        const questionId = i // Frage ID basierend auf der Iteration

        // Finde die entsprechende Antwort für die Frage
        const userAnswer = parseFloat(this.getUserAnswer(questionId))
        const sbwlAnswer = parseFloat(this.getSbwlAnswer(questionId))
        const difference = Math.abs(userAnswer - sbwlAnswer)

        // Füge die Frage, Differenz und ID zur Liste hinzu
        questionsWithDifferences.push({ questionText, difference, id: questionId })
      }

      // Sortiere die Fragen nach Differenz in absteigender Reihenfolge
      return questionsWithDifferences.sort((a, b) => b.difference - a.difference)
    },
  },

  mounted() {
    window.scrollTo(0, 0)
  }
}
</script>

<style>
.sbwl-link {
  text-decoration: underline;
  text-decoration-color: transparent;
  color: inherit;
  transition: all 0.3s ease-in-out;
}
.sbwl-link:hover {
  text-decoration: underline;
  text-decoration-color: #f57c00;
}
</style>
