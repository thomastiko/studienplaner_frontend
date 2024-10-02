<template>
  <div>
    <div class="text-h1 text-center text-weight-medium text-uppercase q-mb-sm">
      Mein Studium
    </div>
    <div class="col-12 row q-gutter-md">
      <q-btn 
        label="Auswählen" 
        icon="edit" 
        @click="toggleSelectionMode" 
        class="q-mb-md"
      />
      <q-btn 
        v-if="selectionMode && selectedStudies.length > 0"
        label="Löschen" 
        color="negative" 
        icon="delete" 
        @click="deleteSelectedStudies"
        class="q-mb-md"
      />
    </div>
    <div class="column items-center">
      <div 
        class="col q-pa-md q-mb-md q-card"
        v-for="(study, i) in this.userStore.user.studies" 
        :key="i"
        style="display: flex; align-items: center; border: 1px solid #ddd; border-radius: 8px;"
      >
        <!-- Checkbox wird nur im Auswahlmodus angezeigt -->
        <q-checkbox 
          v-if="selectionMode" 
          v-model="selectedStudies" 
          :val="study.study_id" 
          class="q-mr-md"
        />
        <q-card 
          class="my-card cursor-pointer" 
          v-ripple 
          @click="openStudy(study.study_id)"
          style="flex-grow: 1;"
        >
          <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
            <div class="absolute-bottom">
              <div class="text-h4 text-white">{{ study.study_name_short }}</div>
              <div class="text-subtitle1">{{ study.study_name }}</div>
            </div>
          </q-img>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user.store';

export default {
  setup() {
    const userStore = useUserStore();
    return {
      userStore,
    };
  },
  data() {
    return {
      selectionMode: false, // Auswahlmodus aktiviert oder deaktiviert
      selectedStudies: [], // Ausgewählte Studien
    };
  },
  methods: {
    openStudy(study_id) {
      if (!this.selectionMode) {
        this.$router.push({ name: 'Studyplan', params: { study_id } });
      }
    },
    toggleSelectionMode() {
      this.selectionMode = !this.selectionMode;
      // Auswahl zurücksetzen, wenn Auswahlmodus deaktiviert wird
      if (!this.selectionMode) {
        this.selectedStudies = [];
      }
    },
    deleteSelectedStudies() {
      this.selectedStudies.forEach((study_id) => {
        this.userStore.deleteStudy(study_id);
      });
      this.selectedStudies = [];
      this.selectionMode = false; // Optional: Auswahlmodus deaktivieren nach dem Löschen
    },
  },
  mounted() {
    this.userStore.fetchUser();
  },
};
</script>

<style scoped>
.my-card {
  min-width: 350px;
  max-width: 400px;
  width: 100%;
  transition: all 0.3s;
}

.my-card:hover {
  filter: brightness(1.1);
}

.col {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Rahmen mit Schatten für bessere Sichtbarkeit */
  border-radius: 8px; /* Abgerundete Ecken */
}
</style>
