<template>
  <div>
    <div class="text-h1 text-center text-weight-medium text-uppercase q-mb-sm q-mt-md">
      Studien&shy;gänge
    </div>
    <div class="text-h5 text-center text-weight-medium q-mb-lg">
        {{ $t('studies.subtitle_1') }}
      </div>
    <div class="q-pa-md">
      <q-stepper v-model="step" class="stepper" ref="stepper" color="primary" animated>
        <!-- Schritt 1: Studiengang auswählen -->
        <q-step
          class="step"
          :name="1"
          :title="$t('studies.select_study_program')"
          active-icon="fa-solid fa-1"
          icon="fa-solid fa-1"
          :done="step > 1"
        >
          <div class="row justify-center">
            <div class="q-gutter-md">
              <q-card
                v-ripple
                class="my-box cursor-pointer"
                style="min-width: 300px"
                @click="selectStudy('wiso')"
              >
                <q-card-section class="bg-blue-4">
                  <div class="text-h4 text-white">WISO 23</div>
                  <div class="text-subtitle2 text-white">Wirtschafts- und Sozialwissenschaften</div>
                </q-card-section>
              </q-card>
              <q-card
                v-ripple
                class="my-box cursor-pointer"
                style="min-width: 300px"
                @click="selectStudy('wire-23')"
              >
                <q-card-section class="bg-blue-4">
                  <div class="text-h4 text-white">WIRE 23</div>
                  <div class="text-subtitle2 text-white">Wirtschaftsrecht</div>
                </q-card-section>
              </q-card>
              <q-card
                v-ripple
                class="my-box cursor-pointer"
                style="min-width: 300px"
                @click="selectStudy('bbe')"
              >
                <q-card-section class="bg-blue-4">
                  <div class="text-h4 text-white">BBE</div>
                  <div class="text-subtitle2 text-white">Business and Economics</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-step>
        <!-- Schritt 2: Zweig auswählen (nur für WISO 23) -->
        <q-step
          class="step"
          :name="2"
          :title="$t('studies.select_study_branch')"
          active-icon="fa-solid fa-2"
          icon="fa-solid fa-2"
          :done="step > 2"
        >
          <div v-if="selectedStudy === 'wiso'" class="row justify-center">
            <div class="q-gutter-md">
              <q-btn
                label="Betriebswirtschaft"
                color="blue-4"
                padding="sm xl"
                size="lg"
                @click="selectBranch('wiso-bwl-23')"
              />
              <q-btn
                label="Internationale Betriebswirtschaft"
                color="blue-4"
                padding="sm xl"
                size="lg"
                @click="selectBranch('wiso-ibw-23')"
              />
              <q-btn
                label="Volkswirtschaft"
                color="blue-4"
                padding="sm xl"
                size="lg"
                @click="selectBranch('wiso-vwl-23')"
              />
              <q-btn
                label="Wirtschaftsinformatik"
                color="blue-4"
                padding="sm xl"
                size="lg"
                @click="selectBranch('wiso-winf-23')"
              />
              <q-btn
                label="Wirtschaft - Umwelt - Politik"
                color="blue-4"
                padding="sm xl"
                size="lg"
                @click="selectBranch('wiso-wupol-23')"
              />
            </div>
          </div>
        </q-step>
        <!-- Schritt 3: Fertig -->
        <q-step
          class="step"
          :name="3"
          :title="$t('studies.finish')"
          active-icon="fa-solid fa-3"
          icon="fa-solid fa-3"
        >
          <q-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="text-h6"> {{ $t('studies.your_selection') }} </div>
              <p>
                <strong>{{ $t('studies.study_program') }}: </strong>
                <span v-if="selectedStudy === 'wiso'"
                  >Wirtschafts- und Sozialwissenschaften 2023</span
                >
                <span v-else-if="selectedStudy === 'wire-23'">Wirtschaftsrecht 2023</span>
                <span v-else-if="selectedStudy === 'bbe'">Business and Economics 2023</span>
              </p>
              <p v-if="selectedStudy === 'wiso'">
                <strong>{{ $t('studies.study_branch') }}: </strong>
                <span v-if="selectedBranch === 'wiso-bwl-23'">Betriebswirtschaft</span>
                <span v-else-if="selectedBranch === 'wiso-ibw-23'"
                  >Internationale Betriebswirtschaft</span
                >
                <span v-else-if="selectedBranch === 'wiso-vwl-23'">Volkswirtschaft</span>
                <span v-else-if="selectedBranch === 'wiso-winf-23'">Wirtschaftsinformatik</span>
                <span v-else-if="selectedBranch === 'wiso-wupol-23'"
                  >Wirtschaft - Umwelt - Politik</span
                >
              </p>
            </q-card-section>
            <q-card-actions align="center">
              <q-btn @click="confirmSelection" label="Studiengang hinzufügen" color="primary" />
            </q-card-actions>
          </q-card>
        </q-step>

        <!-- Navigation -->
        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn
              v-if="step > 1 && selectedStudy == 'wiso'"
              flat
              color="primary"
              @click="$refs.stepper.previous()"
              :label="$t('studies.back')"
              icon="arrow_back"
              class="q-ml-sm"
            />
            <q-btn
            v-else-if="step > 1 && selectedStudy != 'wiso'"
            flat
            color="primary"
            @click="step = 1"
            :label="$t('studies.back')"
            icon="arrow_back"
            class="q-ml-sm"
          />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const userStore = useUserStore()
    const $q = useQuasar()
    const step = ref(1)
    const selectedStudy = ref(null)
    const selectedBranch = ref(null)
    const router = useRouter()


    // Map für schöne Namen
    const studyNames = ref({
      'wiso-bwl-23': 'Betriebswirtschaf 2023',
      'wiso-ibw-23': 'Internationale Betriebswirtschaft 2023',
      'wiso-vwl-23': 'Volkswirtschaft 2023',
      'wiso-winf-23': 'Wirtschaftsinformatik 2023',
      'wiso-wupol-23': 'Wirtschaft - Umwelt - Politik 2023',
      'wire-23': 'Wirtschaftsrecht 2023',
      bbe: 'Business and Economics',
      wiso: 'WiSo 2023'
    })

    const selectStudy = (study) => {
      selectedStudy.value = study
      if (study === 'bbe' || study === 'wire-23') {
        step.value = 3
        selectedBranch.value = null
      } else {
        step.value = 2
      }
    }

    const selectBranch = (branch) => {
      selectedBranch.value = branch
      step.value = 3
    }

    const confirmSelection = async () => {
      // Formatieren der Study ID
      let studyId = selectedBranch.value
      if (selectedBranch.value == null) {
        studyId = selectedStudy.value
      }

      try {
        console.log('Studiengang speichern:', studyId)
        // Studiengang speichern
        await userStore.addStudy(studyId)
        router.push({ name: 'my-study', route: '/my-study' })

        // Schönen Namen verwenden für die Benachrichtigung
        const displayName = studyNames.value[studyId] || studyId

        $q.notify({
          type: 'positive',
          message: `${displayName} wurde hinzugefügt`,
          position: 'bottom',
          timeout: 2000
        })
      } catch (error) {
        console.error('Fehler beim Speichern des Studiengangs:', error)
        $q.notify({
          type: 'negative',
          message: 'Fehler beim Speichern des Studiengangs',
          position: 'bottom',
          timeout: 2000
        })
      }
    }

    return {
      step,
      selectedStudy,
      selectedBranch,
      selectStudy,
      selectBranch,
      confirmSelection,
      studyNames,
      router
    }
  }
}
</script>

<style scoped>
.my-box {
  transition: all 0.3s;
}

.my-box:hover {
  filter: brightness(1.1);
}
.step {
  min-height: 400px;
}
</style>
