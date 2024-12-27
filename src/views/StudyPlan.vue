<template>
  <div>
    <div v-if="selectedStudy">
      <div class="text-h4 text-center text-bold q-mt-md">{{ selectedStudy.study_name }}</div>
      <div class="row justify-center q-ma-md">
        <Dashboard :selectedStudy="selectedStudy" />
      </div>
      <!-- Iteration durch Phasen und die Fächer, die zu diesen Phasen gehören -->
      <q-expansion-item
        v-model="expandedItem[phase]"
        v-for="(subjects, phase) in groupedSubjects"
        :key="phase"
        class="shadow-1 q-ma-md"
      >
        <template v-slot:header>
          <q-item-section>
            <div class="text-h5 text-bold text-uppercase">{{ phase === 'Hauptstudium' ? $t('studyPlan.main_program') : phase }}</div>
          </q-item-section>

          <q-item-section>
            <div>{{ subjects.length }} Lehrveranstalungen</div>
          </q-item-section>
        </template>
        <div class="q-ma-sm q-pa-sm row q-col-gutter-md items-stretch">
          <div
            class="col-12 col-md-3"
            style="max-width: 450px"
            v-for="subject in subjects"
            :key="subject._id"
          >
            <Subject
              :subject="subject"
              @status-change="updateStatus"
              :selectionMode="selectionMode"
              @add-subject-to-cart="handleLvCart(subject)"
              @show-path="showPath(subject)"
            />
          </div>
        </div>
      </q-expansion-item>

      <!-- SBWLs -->
      <div>
        <SbwlCarousel :selectedStudy="selectedStudy" :sbwlsAvailable="sbwlsAvailable" />
      </div>

      <!-- Freie Wahlfächer -->
      <div v-if="this.study_id !== 'wire' && this.study_id !== 'wire-23'">
        <FreeElectiveCarousel
          :selectedStudy="selectedStudy"
          :freeElectivesAvailable="freeElectivesAvailable"
        />
      </div>

      <!-- Cart -->
      <div>
        <Cart
          :selectionMode="selectionMode"
          @activate-selection-mode="ActivateSelectionMode"
          @deactivate-selection-mode="DeactivateSelectionMode"
        />
      </div>
    </div>
    <div v-else>
      <p>Study not found.</p>
    </div>
    <!-- Dialog für den Pfad -->
    <q-dialog v-model="pathDialog">
      <q-card>
        <q-card-section class="q-pb-none">
          <div class="text-h6"> {{$t('studyPlan.path_information')}} </div>
        </q-card-section>
        <q-card-section>
          <!-- Path anzeigen -->
          <div v-if="selectedPath.value.length">
            <div class="text-body1">
              {{$t('studyPlan.path_information_text')}}:
            </div>
            <div v-if="filteredPath.length">
            <div class="text-body1">{{$t('studyPlan.path_information_subjects')}}:</div>
            <q-list dense>
              <q-item v-for="(item, index) in filteredPath" :key="index">
                <div class="q-mt-sm text-bold">
                  <div>- {{ item.name }}</div>
                </div>
              </q-item>
            </q-list>
            </div>
            <div v-for="(item, index) in selectedPath.value" :key="index">
              <div v-if="item.type == 'text'">
                <div class="text-body1 q-mt-sm text-bold" v-if="filteredPath.length">{{$t('studyPlan.additional_information')}}:</div>
                <div class="text-body2">{{ $t(item.key) }}</div>
              </div>
            </div>
          </div>
          <div v-else>
            <p>Kein Path gefunden.</p>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('studyPlan.close')" @click="pathDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user.store'
import { useLvStore } from '@/stores/lv.store'
import { getChecker, getPath } from '@/stores/study_logic'
import Subject from '../components/studyplaner/subject.vue'
import SbwlCarousel from '../components/studyplaner/sbwlCarousel.vue'
import FreeElectiveCarousel from '../components/studyplaner/freeElectiveCarousel.vue'
import Dashboard from '../components/studyplaner/dashboard.vue'
import Cart from '../components/studyplaner/cart.vue'
import { ref } from 'vue'
import { useQuasar } from 'quasar'
export default {
  components: {
    Subject,
    SbwlCarousel,
    FreeElectiveCarousel,
    Dashboard,
    Cart
  },
  props: ['study_id'],
  setup(props) {
    let studyId = ref(props.study_id) || window.location.pathname.split('/')[2]

    if (!studyId.value) {
      throw new Error('No study id provided')
    }

    const userStore = useUserStore()
    const lvStore = useLvStore()
    const checker = getChecker(studyId.value)
    const path = getPath(studyId.value)
    const q = useQuasar()
    const expandedItem = ref({})
    const selectionMode = ref(false)
    const pathDialog = ref(false)
    const selectedPath = ref([])

    const initExpandedItems = (groupedSubjects) => {
      for (const phase in groupedSubjects) {
        expandedItem.value[phase] = true
      }
    }

    return {
      userStore,
      lvStore,
      checker,
      path,
      freeElectivesAvailable: ref(false),
      sbwlsAvailable: ref(false),
      q,
      expandedItem,
      initExpandedItems,
      selectionMode,
      pathDialog,
      selectedPath
    }
  },
  data() {
    return {
      studyId: this.study_id
    }
  },
  methods: {
    async updateStatus(subjectId, status, grade) {
      await this.userStore.updateSubjectStatus(
        this.studyId,
        subjectId,
        status,
        grade,
        true,
        this.q.notify
      )
      let update_array = await this.checker.executeAll(this.selectedStudy)
      await this.userStore.updateBulkSubjectStatus(this.studyId, update_array)

      if (!this.freeElectivesAvailable && this.selectedStudy.free_electives.length > 0) {
        await this.userStore.deleteEveryFreeElectiveFromStudy(this.studyId)
      }
      if (!this.sbwlsAvailable && this.selectedStudy.sbwl_states.length > 0) {
        await this.userStore.deleteEverySbwlFromStudy(this.studyId)
      }
    },
    ActivateSelectionMode() {
      this.selectionMode = true
    },
    DeactivateSelectionMode() {
      this.selectionMode = false
      this.lvStore.cart.length = 0
    },
    handleLvCart(subject) {
      if (!this.lvStore.cart.includes(subject)) {
        this.lvStore.addToCart(subject)
      } else {
        this.lvStore.removeFromCart(subject)
      }
    },
    showPath(subject) {
      const path = this.path.executePath(this.selectedStudy, subject)
      this.selectedPath.value = path
      if (this.selectedPath.value.length > 0) {
      this.pathDialog = true
      } else {
        return
      }
    }
    /*handleDrop(evt) {
      let name = evt.dataTransfer.getData('SubjectName')
      let ects = evt.dataTransfer.getData('SubjectEcts')
      this.lvStore.addToCart(name, ects)
    }*/
  },
  computed: {
    selectedStudy() {
      return this.userStore.user.studies.find((study) => study.study_id === this.studyId)
    },
    sbwlSubjects() {
      return this.selectedStudy.subject_states.filter((subject) => subject.subject_type === 'SBWL')
    },
    freeElectives() {
      return this.selectedStudy.subject_states.filter((subject) => subject.subject_type === 'ANY')
    },
    groupedSubjects() {
      if (!this.selectedStudy || !this.selectedStudy.subject_states) {
        return {}
      }

      // Gruppieren der subject_states nach Phase
      return this.selectedStudy.subject_states.reduce((groups, subject) => {
        const phase = subject.phase
        if (!groups[phase]) {
          groups[phase] = []
        }
        groups[phase].push(subject)
        return groups
      }, {})
    },
    filteredPath() {
      return this.selectedPath.value.filter((item) => item.type !== 'text')
    }
  },
  watch: {
    freeElectives: {
      handler(newVal, oldVal) {
        this.freeElectivesAvailable = newVal.some(
          (subject) => subject.status === 'can-do' || subject.status === 'done'
        )
      },
      deep: true,
      immediate: true
    },
    sbwlSubjects: {
      handler(newVal, oldVal) {
        this.sbwlsAvailable = newVal.some(
          (subject) => subject.status === 'can-do' || subject.status === 'done'
        )
      },
      deep: true,
      immediate: true
    },
    'selectedStudy.free_electives': {
      async handler(newVal, oldVal) {
        // Überprüfen, ob study_id nicht "wire-23" ist
        if (this.selectedStudy.study_id !== 'wire-23') {
          // `checkWahlfach` aufrufen, um den aktuellen Status zu ermitteln
          const updateArray = await this.checker.checkWahlfach(this.selectedStudy)

          // Gehe das Update-Array durch und aktualisiere den Status in `userStore`
          for (const update of updateArray) {
            await this.userStore.updateSubjectStatus(
              this.selectedStudy.study_id,
              update._id,
              update.status,
              null,
              false,
              this.q.notify
            )
            console.log(`Status von Wahlfach ID ${update._id} auf ${update.status} gesetzt.`)
          }
        } else {
          console.log('Handler für `free_electives` übersprungen, da study_id `wire-23` ist.')
        }
      },
      deep: true,
      immediate: true
    },
    'selectedStudy.sbwl_states': {
      async handler() {
        if (this.selectedStudy.study_id == 'wire-23') {
          const twoCbkSubjectsDone = this.checker.checkHs(this.selectedStudy)
          const steopsDone = this.checker.checkSTEOPs(this.selectedStudy)
          const sbwlUpdates = await this.checker.checkSbwl(
            this.selectedStudy,
            twoCbkSubjectsDone,
            steopsDone
          )
          // Wende die Updates für `sbwl_states` an
          sbwlUpdates.forEach(async (update) => {
            await this.userStore.updateSubjectStatus(
              this.studyId,
              update._id,
              update.status,
              update.grade,
              false,
              this.q.notify
            )
          })
        } else {
          const totalDoneECTSValue = this.checker.totalDoneECTS(this.selectedStudy)
          const steopsDone = this.checker.checkSTEOPs(this.selectedStudy)
          const sbwlUpdates = await this.checker.checkSbwl(
            this.selectedStudy,
            totalDoneECTSValue,
            steopsDone
          )
          // Wende die Updates für `sbwl_states` an
          sbwlUpdates.forEach(async (update) => {
            await this.userStore.updateSubjectStatus(
              this.studyId,
              update._id,
              update.status,
              update.grade,
              false,
              this.q.notify
            )
          })
        }
      },
      deep: true,
      immediate: true
    },
    groupedSubjects: {
      handler(newVal) {
        // Überprüfe, ob alle Subjects in einer Phase auf "done" sind
        for (const [phase, subjects] of Object.entries(newVal)) {
          const allDone = subjects.every((subject) => subject.status === 'done')
          this.expandedItem[phase] = !allDone // Wenn alle "done", klappe zu (false)
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    console.log(this.userStore.user)
  }
}
</script>

<style scoped></style>
