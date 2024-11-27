<template>
  <div>
    <div v-if="selectedStudy">
      <div class="text-h4 text-center text-bold q-mt-md">{{ selectedStudy.study_name }}</div>
      <div class="row justify-center q-ma-md">
        <Dashboard :selectedStudy="selectedStudy" />
      </div>
      <!-- Iteration durch Phasen und die Fächer, die zu diesen Phasen gehören -->
      <div v-for="(subjects, phase) in groupedSubjects" :key="phase" class="shadow-1 q-ma-md">
        <div class="q-pa-md row q-col-gutter-md items-stretch">
          <div class="col-12 row justify-between items-center">
            <div class="text-h5 text-bold text-uppercase">{{ phase }}</div>
            <div>{{ subjects.length }} Lehrveranstalungen</div>
          </div>
          <div
            class="col-12 col-md-3"
            style="max-width: 450px"
            v-for="subject in subjects"
            :key="subject._id"
          >
            <Subject
              :subject="subject"
              @status-change="updateStatus"
              @handle-drag-start="handleDragStart($event, subject)"
              @drag="handleDrag"
              @dragend="handleDragEnd"
            />
          </div>
        </div>
      </div>

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
        <Cart :seamless="seamless" @drop="handleDrop" @update:seamless="updateSeamless" />
      </div>
    </div>
    <div v-else>
      <p>Study not found.</p>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user.store'
import { useLvStore } from '@/stores/lv.store'
import { getChecker } from '@/stores/study_logic'
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
    const q = useQuasar()
    return {
      userStore,
      lvStore,
      checker,
      seamless: ref(false),
      freeElectivesAvailable: ref(false),
      sbwlsAvailable: ref(false),
      q
    }
  },
  data() {
    return {
      studyId: this.study_id
    }
  },
  methods: {
    async updateStatus(subjectId, status, grade) {
      await this.userStore.updateSubjectStatus(this.studyId, subjectId, status, grade, true, this.q.notify)
      let update_array = await this.checker.executeAll(this.selectedStudy)
      await this.userStore.updateBulkSubjectStatus(this.studyId, update_array)

      if (!this.freeElectivesAvailable && this.selectedStudy.free_electives.length > 0) {
        await this.userStore.deleteEveryFreeElectiveFromStudy(this.studyId)
      }
      if (!this.sbwlsAvailable && this.selectedStudy.sbwl_states.length > 0) {
        await this.userStore.deleteEverySbwlFromStudy(this.studyId)
      }
    },
    updateSeamless(value) {
      this.seamless = value
    },
    handleDragStart(evt, subject) {
      this.seamless = true

      // DataTransfer object setup
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('SubjectName', subject.name)
      evt.dataTransfer.setData('SubjectEcts', subject.ects)

      // Creating a custom drag image
      const dragImage = document.createElement('div')
      dragImage.style.width = '150px'
      dragImage.style.height = '100px'
      dragImage.style.border = '1px solid #ccc'
      dragImage.style.borderRadius = '6px'
      dragImage.style.backgroundColor = 'white'
      dragImage.style.display = 'flex'
      dragImage.style.alignItems = 'center'
      dragImage.style.justifyContent = 'center'
      dragImage.style.boxShadow = '0 1px 5px rgba(0, 0, 0, 0.2)'
      dragImage.innerHTML = `<strong>${subject.name}</strong>`

      document.body.appendChild(dragImage)

      // Set custom drag image
      evt.dataTransfer.setDragImage(dragImage, 75, 50)

      // Remove drag image after drag ends
      evt.target.addEventListener('dragend', () => {
        dragImage.remove()
      })
    },
    handleDrag(evt) {
      evt.preventDefault()
    },
    handleDragEnd() {
      if (this.lvStore.cart.length === 0) {
        this.seamless = false
      } else {
        return
      }
    },
    handleDrop(evt) {
      let name = evt.dataTransfer.getData('SubjectName')
      let ects = evt.dataTransfer.getData('SubjectEcts')
      this.lvStore.addToCart(name, ects)
    }
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
          const sbwlUpdates = await this.checker.checkSbwl(this.selectedStudy, twoCbkSubjectsDone, steopsDone)
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
          const sbwlUpdates = await this.checker.checkSbwl(this.selectedStudy, totalDoneECTSValue, steopsDone)
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
    }
  },
  mounted() {
    console.log(this.userStore.user)
  }
}
</script>

<style scoped></style>
