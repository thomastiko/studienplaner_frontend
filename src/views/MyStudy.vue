<template>
  <div>
    <div class="text-h1 text-center text-weight-medium text-uppercase q-mb-sm q-mt-md">
      Mein Studium
    </div>
    <div class="text-h5 text-center text-weight-medium q-mb-lg">
      Behalte dein Studium im Überblick
    </div>

    <!-- Studium bearbeiten und hinzufügen/entfernen Button immer anzeigen -->
    <div class="col-12 row q-gutter-md q-pa-md">
      <q-btn
        label="Studium bearbeiten"
        icon-right="edit"
        @click="toggleSelectionMode"
        class="q-mb-md"
      >
        <q-tooltip>Studium hinzufügen oder entfernen</q-tooltip>
      </q-btn>
      <q-btn
        v-if="selectionMode"
        label="Studium hinzufügen"
        color="positive"
        icon="add"
        @click="this.$router.push({ name: 'studies', route: '/studies' })"
        class="q-mb-md"
      />
      <q-btn
        v-if="selectionMode"
        label="Studium Löschen"
        color="negative"
        :disable="selectedStudies.length === 0"
        icon="delete"
        @click="deleteSelectedStudies"
        class="q-mb-md"
      />
    </div>

    <!-- Wenn keine Studiengänge vorhanden sind, zeige den "leeren Zustand" -->
    <div v-if="this.userStore.user.studies.length === 0" class="text-center q-pa-md">
      <div class="text-h4 q-mb-md" style="color: grey">Ooooopsie, ziemlich leer hier...</div>
      <div class="text-h5 q-mb-sm" style="color: grey">Füge jetzt dein Studium hinzu:</div>
      <q-btn
        label="Studium hinzufügen"
        color="primary"
        icon="add"
        @click="this.$router.push({ name: 'studies', route: '/studies' })"
      >
        <q-tooltip>Jetzt ein Studium hinzufügen</q-tooltip>
      </q-btn>
    </div>

    <!-- Wenn Studiengänge vorhanden sind, zeige die Liste der Studiengänge -->
    <div v-else class="row justify-center q-gutter-md">
      <div
        class="col q-pa-md q-mb-md q-card"
        v-for="(study, i) in this.userStore.user.studies"
        :key="i"
        style="
          display: flex;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 8px;
          max-width: 400px;
        "
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
          style="flex-grow: 1"
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
    <div class="q-mt-lg">
      <Calendar />
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user.store'
import { useLvStore } from '@/stores/lv.store'
import Calendar from '@/components/lvplaner/calendar.vue'

export default {
  components: {
    Calendar
  },
  setup() {
    const userStore = useUserStore()
    const lvStore = useLvStore()
    return {
      userStore,
      lvStore
    }
  },
  data() {
    return {
      selectionMode: false, // Auswahlmodus aktiviert oder deaktiviert
      selectedStudies: [] // Ausgewählte Studien
    }
  },
  methods: {
    openStudy(study_id) {
      if (!this.selectionMode) {
        this.$router.push({ name: 'Studyplan', params: { study_id } })
      }
    },
    toggleSelectionMode() {
      this.selectionMode = !this.selectionMode
      // Auswahl zurücksetzen, wenn Auswahlmodus deaktiviert wird
      if (!this.selectionMode) {
        this.selectedStudies = []
      }
    },
    deleteSelectedStudies() {
      this.selectedStudies.forEach((study_id) => {
        this.userStore.deleteStudy(study_id)
      })
      this.selectedStudies = []
      this.selectionMode = false // Optional: Auswahlmodus deaktivieren nach dem Löschen
    }
  },
  mounted() {
    this.userStore.fetchUser()
  }
}
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
