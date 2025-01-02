<template>
  <div>
    <div class="shadow-1 q-ma-md">
      <div class="q-pa-md row items-stretch">
        <div class="col-12 row justify-between items-center">
          <div id="free-electives-title" class="text-h5 text-bold text-uppercase"> {{$t('studyPlan.free_electives')}} </div>
          <div>{{ getFreeElectivesEcts().ects}} ECTS</div>
        </div>
      </div>
      <div class="col-12 row items-center q-pa-md">
        <div class="col-12 row items-center q-col-gutter-md">
          <div
            v-for="(freeElective, i) in this.selectedStudy.free_electives"
            :key="i"
            class="col-12 col-md-3"
            style="max-width: 450px"
          >
            <FreeElectiveSubject
              :subject="freeElective"
              @delete-free-elective="deleteFreeElective"
            />
          </div>
          <div>
            <q-btn :label="$t('studyPlan.add_free_elective')" no-caps  icon-right="add_circle" color="blue-7" @click="freeElectiveDialog = true" :disable="!freeElectivesAvailable" />
          </div>
        </div>
      </div>
    </div>
    <!-- Dialog -->
    <q-dialog v-model="freeElectiveDialog">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">{{$t('studyPlan.add_free_elective')}}</div>
        </q-card-section>

        <q-card-section class="row justify-start q-col-gutter-xl q-pt-none">
          <!-- Name -->
          <div class="col-6">
            <q-input
              filled
              v-model="name"
              type="text"
              label="Name"
              :hint="$t('studyPlan.name_hint')"
            />
          </div>
          <!-- ECTS -->
          <div class="col-6">
            <q-input filled v-model="ects" type="number" label="ECTS" :hint="$t('studyPlan.ects_hint')" />
          </div>
        </q-card-section>
        <q-card-section class="row justify-start q-gutter-md">
          <!-- TYPE -->
          <q-btn-dropdown outline :label="$t('studyPlan.type') + selectedType">
            <q-list>
              <q-item
                v-model="selectedType"
                v-for="subject_type in subject_types"
                :key="subject_type"
                clickable
                v-close-popup
                @click="selectedType = subject_type"
              >
                <q-item-section>
                  <q-item-label>{{ subject_type }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <!-- GRADE -->
          <q-btn-dropdown outline :label="'Note: ' + (selectedGrade !== undefined ? selectedGrade : '')">
            <q-list>
              <q-item
                v-model="selectedGrade"
                v-for="grade in grades"
                :key="grade"
                clickable
                v-close-popup
                @click="selectedGrade = grade"
              >
                <q-item-section>
                  <q-item-label>
                    {{ grade }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat color="negative" :label="$t('studyPlan.cancel')" v-close-popup />
          <q-btn
            flat
            color="positive"
            :label="$t('studyPlan.add')"
            @click="selectFreeElective"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.store'
import FreeElectiveSubject from './freeElectiveSubject.vue'
import { useQuasar } from 'quasar'
export default {
  components: {
    FreeElectiveSubject
  },
  props: {
    selectedStudy: {
      type: Object,
      required: true
    },
    freeElectivesAvailable: {
      type: Boolean,
      required: true
    },
  },
  setup() {
    const userStore = useUserStore()
    const q = useQuasar()
    return {
      userStore,
      q,
      freeElectiveDialog: ref(false),
      grades: ref(['1', '2', '3', '4', 'Teilgenommen']),
      subject_types: ref(['LVP', 'VUE', 'PI', 'Any']),
      name: ref(''),
      ects: ref(),
      selectedType: ref(''),
      selectedGrade: ref()
    }
  },
  methods: {
    getFreeElectivesEcts() {
      const categories = ['Free Electives and Internship', 'Freies Wahlfach']

      return this.selectedStudy.subject_states.find((obj) => {
        return categories.includes(obj.category)
      })
    },
    selectFreeElective() {
      try {
      const freeElective = {
        name: this.name,
        ects: this.ects,
        subject_type: this.selectedType,
        grade: this.selectedGrade === "Teilgenommen" ? null : this.selectedGrade
      }
      this.userStore.addFreeElectiveToStudy(this.selectedStudy.study_id, freeElective, this.q.notify)
      this.name = ''
      this.ects = ''
      this.selectedType = ''
      this.selectedGrade = ''

      } catch (error) {
        console.log(error)
      }
    },
    deleteFreeElective(freeElective) {
      try {
      this.userStore.deleteFreeElectiveFromStudy(this.selectedStudy.study_id, freeElective, this.q.notify)
      this.q.notify({
        message: 'Wahlfach gelöscht',
        color: 'positive',
        position: 'bottom'
      })
      } catch (error) {
        this.q.notify({
          message: 'Fehler beim Löschen des Wahlfachs',
          color: 'negative',
          position: 'bottom'
        })
      }
    }
  },
  mounted() {
  }
}
</script>

<style></style>
