<template>
  <div>
    <div class="shadow-1 q-ma-md">
      <div class="q-pa-md row items-stretch">
        <div class="col-12 row justify-between items-center">
          <div class="text-h5 text-bold text-uppercase">Freie Wahlfächer</div>
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
            <q-btn round stack icon="add" color="blue-7" @click="freeElectiveDialog = true" />
          </div>
        </div>
      </div>
    </div>
    <!-- Dialog -->
    <q-dialog v-model="freeElectiveDialog">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Wahlfach hinzufügen</div>
        </q-card-section>

        <q-card-section class="row justify-start q-col-gutter-xl q-pt-none">
          <!-- Name -->
          <div class="col-6">
            <q-input
              filled
              v-model="name"
              type="text"
              label="Name"
              hint="Name der Lehrveranstaltung"
            />
          </div>
          <!-- ECTS -->
          <div class="col-6">
            <q-input filled v-model="ects" type="number" label="ECTS" hint="ECTS-Punkte" />
          </div>
        </q-card-section>
        <q-card-section class="row justify-start q-gutter-md">
          <!-- TYPE -->
          <q-btn-dropdown outline :label="'Typ: ' + selectedType">
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
          <q-btn flat color="negative" label="Abbrechen" v-close-popup />
          <q-btn
            flat
            color="positive"
            label="Hinzufügen"
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
export default {
  components: {
    FreeElectiveSubject
  },
  props: {
    selectedStudy: {
      type: Object,
      required: true
    }
  },
  setup() {
    const userStore = useUserStore()
    return {
      userStore,
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
      const freeElective = {
        name: this.name,
        ects: this.ects,
        subject_type: this.selectedType,
        grade: this.selectedGrade
      }
      this.userStore.addFreeElectiveToStudy(this.selectedStudy.study_id, freeElective)
    },
    deleteFreeElective(freeElective) {
      this.userStore.deleteFreeElectiveFromStudy(this.selectedStudy.study_id, freeElective)
    }
  },
  mounted() {
    console.log(this.selectedStudy)
  }
}
</script>

<style></style>
