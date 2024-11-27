<template>
  <div v-if="selectedStudy">
    <div class="col-12 row justify-center q-gutter-sm">
      <q-card>
        <q-card-section class="text-center">
          <q-card-section>
            <div class="text-h6">Aktuell</div>
          </q-card-section>
          <div class="text-body1">
            LVs: {{ userStore.allCurrentSubjects(selectedStudy.study_id).length }}
          </div>
          <div class="text-body1">ECTS: {{ userStore.allCurrentEcts(selectedStudy.study_id) }}</div>
        </q-card-section>
      </q-card>
      <q-card>
        <q-card-section class="text-center">
          <q-card-section>
            <div class="text-h6">Abgeschlossen</div>
          </q-card-section>
          <div class="text-body1">
            LVs: {{ userStore.allCompletedSubjects(selectedStudy.study_id).length }}
          </div>
          <div class="text-body1">
            ECTS: {{ userStore.allCompletedEcts(selectedStudy.study_id).totalEcts }}
            <span v-if="userStore.allCompletedEcts(selectedStudy.study_id).overflowEcts > 0">
              ({{ userStore.allCompletedEcts(selectedStudy.study_id).overflowEcts }})
            </span>
          </div>
        </q-card-section>
      </q-card>
      <q-card>
        <q-card-section class="text-center">
          <q-card-section>
            <div class="text-h6">GPA</div>
          </q-card-section>
          <div class="text-body1">{{ userStore.gpa(selectedStudy.study_id) }}</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
  <div v-else>
    <p>Daten werden geladen...</p>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user.store.js'

export default {
  props: {
    selectedStudy: {
      type: Object,
      required: true
    }
  },
  setup() {
    const userStore = useUserStore()

    return {
      userStore
    }
  }
}
</script>
