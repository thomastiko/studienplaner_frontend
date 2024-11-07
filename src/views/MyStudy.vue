<template>
  <div>
    <div class="text-h1 text-center text-weight-medium text-uppercase q-mb-sm q-mt-md">
      {{ $t('myStudy.heading_1') }}
    </div>
    <div class="text-h5 text-center text-weight-medium q-mb-lg">
      {{ $t('myStudy.subtitle_1') }}
    </div>

    <!-- Studium bearbeiten und hinzufügen/entfernen Button immer anzeigen -->
    <div class="col-12 row q-gutter-md q-pa-md">
      <q-btn
        :label="$t('myStudy.edit_study_button')"
        icon-right="edit"
        @click="toggleSelectionMode"
        class="q-mb-md"
      >
        <q-tooltip> {{ $t('myStudy.edit_study_button_tooltip') }} </q-tooltip>
      </q-btn>
      <q-btn
        v-if="selectionMode"
        :label="$t('myStudy.add_study_button')"
        color="positive"
        icon="add"
        @click="this.$router.push({ name: 'studies', route: '/studies' })"
        class="q-mb-md"
      />
      <q-btn
        v-if="selectionMode"
        :label="$t('myStudy.delete_study_button')"
        color="negative"
        :disable="selectedStudies.length === 0"
        icon="delete"
        @click="deleteSelectedStudies"
        class="q-mb-md"
      />
    </div>

    <!-- Wenn keine Studiengänge vorhanden sind, zeige den "leeren Zustand" -->
    <div v-if="this.userStore.user.studies.length === 0" class="text-center q-pa-md">
      <div class="text-h4 q-mb-md" style="color: grey">{{ $t('myStudy.no_study_selected') }}</div>
      <q-btn
        :label="$t('myStudy.add_study_button')"
        color="primary"
        icon="add"
        @click="this.$router.push({ name: 'studies', route: '/studies' })"
      >
        <q-tooltip> {{ $t('myStudy.add_study_button_tooltip') }} </q-tooltip>
      </q-btn>
    </div>

    <!-- Wenn Studiengänge vorhanden sind, zeige die Liste der Studiengänge -->
    <div v-else class="row justify-center q-gutter-md">
      <div
        class="col-6 q-pa-md q-mb-md q-card"
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
import { useQuasar } from 'quasar'
import Calendar from '@/components/lvplaner/calendar.vue'

export default {
  components: {
    Calendar
  },
  setup() {
    const userStore = useUserStore()
    const lvStore = useLvStore()
    const q = useQuasar()
    return {
      userStore,
      lvStore,
      q
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
      // Löscht alle ausgewählten Studiengänge in einem einzigen Aufruf
      this.userStore
        .deleteStudies(this.selectedStudies, this.q.notify)
        .then(() => {
          this.selectedStudies = []
          this.selectionMode = false // Optional: Auswahlmodus deaktivieren nach dem Löschen
        })
        .catch((error) => {
          console.error('Fehler beim Löschen der Studiengänge:', error.message || error)
        })
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
