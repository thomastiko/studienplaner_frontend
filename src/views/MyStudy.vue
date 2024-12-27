<template>
  <div>
    <div class="text-h2 text-center text-weight-medium text-uppercase q-mb-sm q-mt-md">
      {{ $t('myStudy.heading_1') }}
    </div>
    <div class="text-h6 text-center text-weight-medium q-mb-lg">
      {{ $t('myStudy.subtitle_1') }}
    </div>
    <div class="row justify-center q-ma-sm">
      <div class="col-12 col-md-8 row shadow-1 q-pa-md">
        <div class="col-12">
          <q-toolbar class="text-primary">
            <q-toolbar-title style="color: #00b9f7"> {{ $t('myStudy.study_programs') }} </q-toolbar-title>
            <q-btn
              v-if="$q.screen.gt.sm && this.userStore.user.studies.length !== 0"
              outline
              style="color: #00b9f7"
              dense
              no-caps
              :label="$t('myStudy.add_study_button')"
              icon-right="add"
              @click="this.$router.push({ name: 'studies', route: '/studies' })"
            />
            <q-btn-dropdown
              v-else-if="this.userStore.user.studies.length !== 0"
              fab-mini
              style="color: #00b9f7"
              flat
              dense
              no-caps
              dropdown-icon="add"
              @click.stop="menuVisible = true"
            >
              <q-list separator>
                <q-item
                  clickable
                  v-close-popup
                  class="text-primary"
                  @click="deleteSelectedStudies(study.study_id)"
                >
                  <q-item-section style="color: #00b9f7"> {{ $t('myStudy.add_study_button') }} </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-toolbar>
          <q-separator />
        </div>
        <div v-if="this.userStore.user.studies.length === 0" class="full-width text-center q-pa-md">
          <div class="text-h6" style="color: grey">
            {{ $t('myStudy.no_study_selected_line1') }}
          </div>
          <div class="text-h6 q-mb-md" style="color: grey">
            {{ $t('myStudy.no_study_selected_line2') }}
          </div>
          <q-btn
            :label="$t('myStudy.add_study_button')"
            color="primary"
            icon-right="add"
            @click="this.$router.push({ name: 'studies', route: '/studies' })"
          >
            <q-tooltip> {{ $t('myStudy.add_study_button_tooltip') }} </q-tooltip>
          </q-btn>
        </div>
        <div v-else class="col-12 row justify-center q-gutter-md q-pa-md">
          <q-card
            @click="openStudy(study.study_id)"
            class="my-card"
            v-for="(study, i) in this.userStore.user.studies"
            :key="i"
          >
            <q-card-section style="background-color: #00b9f7">
              <div class="row items-center no-wrap q-mb-md">
                <div class="col">
                  <div class="text-h5 text-bold text-white">{{ study.study_name_short }}</div>
                </div>

                <div class="col-auto">
                  <q-btn color="white" round flat icon="more_vert" @click.stop>
                    <q-menu>
                      <q-list separator>
                        <q-item
                          clickable
                          v-close-popup
                          class="text-negative"
                          @click="deleteSelectedStudies(study.study_id)"
                        >
                          <q-item-section> {{ $t('myStudy.delete_study_button') }} </q-item-section>
                          <q-item-section side>
                            <q-icon color="negative" name="delete" />
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-sm q-pl-md">
              <div class="text-subtitle">{{ study.study_name }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <div class="q-mt-lg q-ma-md">
      <Calendar />
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user.store'
import { useLvStore } from '@/stores/lv.store'
import { useQuasar } from 'quasar'
import { ref } from 'vue'
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
      menuVisible: ref(false),
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
    deleteSelectedStudies(studyId) {
      this.selectedStudies = [studyId]
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
  cursor: pointer;
}
.my-card:hover {
  filter: brightness(0.95);
}
</style>
