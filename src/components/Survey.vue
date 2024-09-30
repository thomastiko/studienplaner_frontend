<template>
  <div ref="survey">
    <div class="row col-12 justify-center">
      <div class="row q-px-md" v-if="currentQuestion">
        <div id="question" style="height: 20vh;" :class="changeClass">{{ $t(currentQuestion.text)  }}</div>
        <div id="booster" :class="['col-12', { active: booster }]">
          {{ $t('survey.activate_booster') }}
        </div>
      </div>
    </div>
    <div
      v-if="currentQuestion && currentQuestion.id !== 1"
      class="row col-12 justify-center"
    >
      <div class="col-xs-12 col-md-6 q-pa-md">
        <q-slider
          :class="space"
          track-size="8px"
          v-model="sliderModel"
          color="deep-orange"
          markers
          :step="1"
          marker-labels
          :min="0"
          :max="5"
        >
          <template v-slot:marker-label-group="scope">
            <div
              v-for="marker in scope.markerList"
              :key="marker.index"
              :class="['text-deep-orange cursor-pointer', marker.classes]"
              :style="marker.style"
              @click="sliderModel = marker.value"
            >
              {{
                marker.value === 0
                  ? $t('survey.slider_label_low')
                  : marker.value === 5
                  ? $t('survey.slider_label_high')
                  : ''
              }}
            </div>
          </template>
        </q-slider>
      </div>
      <div class="col-12 row justify-center q-gutter-xs q-mt-sm">
        <q-btn
          size="lg"
          padding="xs lg"
          color="deep-orange"
          :label="$t('survey.next_button')"
          @click="sendAnswer(sliderModel)"
        />
        <q-btn
          size="lg"
          padding="xs lg"
          color="grey-8"
          :label="$t('survey.skip_button')"
          @click="skipAnswer"
        />
      </div>
      <div class="col-12 row justify-center q-mt-md">
        <q-checkbox
          v-model="boosterStatus"
          :label="$t('survey.booster_checkbox')"
          color="yellow-8"
        />
        <span>
          <q-icon name="fas fa-info-circle" color="grey-8" @click="showBoosterInfo = true" />
        </span>
      </div>

  <!-- Dialog for booster info -->
      <q-dialog v-model="showBoosterInfo">
      <q-card>
        <q-card-section>
          <div class="text-h6">Booster Info</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ $t('survey.booster_info') }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="deep-orange" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>


    </div>
    <div
      v-if="currentQuestion && currentQuestion.id == 1"
      class="row col-12 justify-center"
    >
      <div class="row col-12 justify-center q-gutter-sm">
        <q-checkbox v-model="checkboxes.bw19" label="WISO-19 Betriebswirtschaft" color="orange-8" />
        <q-checkbox
          v-model="checkboxes.test19"
          label="WISO-19 Internationale Betriebswirtschaft"
          color="orange-8"
        />
        <q-checkbox
          v-model="checkboxes.winf19"
          label="WISO-19 Wirtschaftsinformatik"
          color="orange-8"
        />
        <q-checkbox v-model="checkboxes.wire16" label="Wirtschaftsrecht 2016" color="orange-8" />
      </div>
      <div class="row col-12 justify-center q-gutter-sm">
        <q-checkbox v-model="checkboxes.bw23" label="WISO-23 Betriebswirtschaft" color="orange-8" />
        <q-checkbox
          v-model="checkboxes.test23"
          label="WISO-23 Internationale Betriebswirtschaft"
          color="orange-8"
        />
        <q-checkbox v-model="checkboxes.vw23" label="WISO-23 Volkswirtschaft" color="orange-8" />
        <q-checkbox
          v-model="checkboxes.winf23"
          label="WISO-23 Wirtschaftsinformatik"
          color="orange-8"
        />
        <q-checkbox v-model="checkboxes.wire23" label="Wirtschaftsrecht 2023" color="orange-8" />
        <q-checkbox
          v-model="checkboxes.wupol23"
          label="WISO-23 Wirtschaft - Politik - Umwelt"
          color="orange-8"
        />
        <q-checkbox v-model="checkboxes.bbe" label="BBE" color="orange-8" />
      </div>
      <div class="col-12 row justify-center">
        <q-btn
          size="lg"
          padding="xs lg"
          class="q-mt-xl"
          color="deep-orange"
          :label="$t('survey.next_button')"
          @click="sendStudy()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    const sliderModel = ref(2)
    const checkboxes = ref({
      bw19: false,
      test19: false,
      winf19: false,
      wire16: false,
      bw23: false,
      test23: false,
      vw23: false,
      winf23: false,
      wire23: false,
      wupol23: false,
      bbe: false
    })
    return {
      sliderModel,
      checkboxes,
      boosterStatus: ref(false),
      showBoosterInfo: ref(false)
    }
  },
  props: {
    questions: {
      type: Array,
      required: true
    },
    currentQuestionIndex: {
      type: Number,
      required: true
    },
    booster: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    sendStudy() {
      const selectedStudies = Object.entries(this.checkboxes)
        .filter(([key, value]) => value)
        .map(([key]) => key)

      if (selectedStudies.length === 0) {
        this.$q.notify({
          type: 'warning',
          message: this.$t('survey.no_study_selected'),
          position: 'top'
        })
        return
      }

      this.$emit('answer', {
        id: this.currentQuestion.id,
        study: selectedStudies
      })
      this.$emit('study', selectedStudies)
    },
    sendAnswer(answer) {
      this.$emit('answer', {
        id: this.currentQuestion.id,
        question: this.currentQuestion.text,
        weight: answer,
        boost: this.boosterStatus
      })
      this.boosterStatus = false
    },
    skipAnswer() {
      this.$emit('skip')
      this.boosterStatus = false
    },
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex]
    },
    changeClass() {
      return this.booster
        ? 'col-12 text-center text-yellow-8 text-h6'
        : 'col-12 text-center text-h6'
    },
    space() {
      return this.$q.platform.is.desktop ? 'q-mt-xl' : 'q-mt-sm'
    }
  },
  watch: {
    boosterStatus: {
      handler() {
        this.$emit('booster-status', this.boosterStatus)
      },
      deep: true
    }
  },
  mounted() {}
}
</script>

<style>
#question {
  transition: color 0.2s ease-in-out, font-weight 0.2s ease-in-out;
}
#booster {
  display: flex;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}

#booster.active {
  opacity: 1;
}
</style>
