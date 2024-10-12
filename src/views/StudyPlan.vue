<template>
  <div>
    <div v-if="selectedStudy">
      <div class="text-h4 text-center text-bold">{{ selectedStudy.study_name }}</div>
      <div class="row justify-center">
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
            <Subject :subject="subject" @status-change="updateStatus" />
          </div>
        </div>
      </div>


      <!-- SBWLs -->
      <div>
        <SbwlCarousel :selectedStudy="selectedStudy" />
      </div>



      <!-- Freie Wahlfächer -->
      <div v-if="this.study_id !== 'wire' && this.study_id !== 'wire-23'">
        <FreeElectiveCarousel :selectedStudy="selectedStudy" />
      </div>


    </div>
    <div v-else>
      <p>Study not found.</p>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user.store'
import Subject from '../components/studyplaner/subject.vue'
import SbwlCarousel from '../components/studyplaner/sbwlCarousel.vue'
import FreeElectiveCarousel from '../components/studyplaner/freeElectiveCarousel.vue'
import Dashboard from '../components/studyplaner/dashboard.vue'
import { ref } from 'vue'
export default {
  components: {
    Subject,
    SbwlCarousel,
    FreeElectiveCarousel,
    Dashboard

  },
  props: ['study_id'],
  setup(props) {
    let studyId = ref(props.study_id) || window.location.pathname.split('/')[2]

    if (!studyId.value) {
      throw new Error('No study id provided')
    }

    const userStore = useUserStore()
    return {
      userStore
    }
  },
  data() {
    return {
      studyId: this.study_id
    }
  },
  methods: {
    updateStatus(subjectId, status, grade) {
      this.userStore.updateSubjectStatus(this.studyId, subjectId, status, grade)
    }
  },
  computed: {
    selectedStudy() {
      return this.userStore.user.studies.find((study) => study.study_id === this.studyId)
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
  mounted() {
    console.log(this.userStore.user)
  }
}
</script>

<style></style>
