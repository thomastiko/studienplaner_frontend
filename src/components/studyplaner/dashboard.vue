<template>
  <div v-if="selectedStudy">
    <ul>
      <li>
        <div>Aktuelle LVs: {{ userStore.allCurrentSubjects(selectedStudy.study_id).length }} </div>
      </li>
      <li>
        <div>Aktuelle ECTS: {{ userStore.allCurrentEcts(selectedStudy.study_id) }} </div>
      </li>
      <li>
        <div>Abgeschlossene LVs: {{ userStore.allCompletedSubjects(selectedStudy.study_id).length }} </div>
      </li>
      <li>
        <div>Abgeschlossene ECTS: {{ userStore.allCompletedEcts(selectedStudy.study_id) }} </div>
      </li>
      <li>
        <div>Notendurchschnitt: {{ userStore.gpa(selectedStudy.study_id) }} </div>
      </li>
    </ul>
  </div>
  <div v-else>
    <p>Daten werden geladen...</p>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user.store.js';

export default {
  props: {
    selectedStudy: {
      type: Object,
      required: true
    }
  },
  setup() {
    const userStore = useUserStore();


    return {
      userStore,
    };
  }
};
</script>
