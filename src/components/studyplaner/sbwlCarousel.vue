<template>
  <div>
    <div class="shadow-1 q-ma-md">
      <div class="q-pa-md row q-col-gutter-md items-stretch">
        <div class="col-12 row justify-between items-center">
          <div class="text-h5 text-bold text-uppercase">SBWLs</div>
          <div>{{ getSbwlLength().length }} SBWLs</div>
        </div>
      </div>

      <div class="q-pa-sm row" v-for="(sbwl, i) in getSbwlLength()" :key="i">
        <div class="col-12 row">
          <q-btn-dropdown
            color="blue-7"
            :label="`${i + 1} SBWL hinzufügen`"
            dropdown-icon="add_circle"
            :disable="i < this.selectedStudy.sbwl_states.length || !this.sbwlsAvailable"
          >
            <q-item
              clickable
              v-close-popup
              v-for="(sbwl, j) in this.selectedStudy.sbwl_list"
              :key="j"
              @click="selectSbwl(sbwl)"
            >
              <q-item-section>
                <q-item-label
                  >{{ sbwl.name }}
                  <span v-if="sbwl.ects"> - {{ sbwl.ects }} Ects</span></q-item-label
                >
              </q-item-section>
            </q-item>
          </q-btn-dropdown>
        </div>
      </div>

      <div class="col-12 row q-ma-md">
        <div v-for="(sbwl, i) in selectedStudy.sbwl_states" :key="i" class="col-12 q-pb-md">
          <!-- SBWLS -->
          <div v-if="sbwl.sbwl_name !== 'Courses Abroad'">
            <div class="text-h5">{{ sbwl.sbwl_name }}</div>
            <q-btn label="löschen" color="red" @click="deleteSbwl(sbwl)" />
            <div class="col-12 row q-col-gutter-md">
              <div
                v-for="subject in sbwl.subjects"
                class="col-12 col-md-3"
                style="max-width: 450px"
                :key="subject.subject_id"
              >
                <Subject
                  :subject="subject"
                  @status-change="
                    (subjectId, status, grade) => updateStatus(subjectId, status, grade, sbwl)
                  "
                />
              </div>
            </div>
          </div>

          <!-- Courses Abroad -->
          <div v-else>
            <div class="text-h5">{{ sbwl.sbwl_name }}</div>
            <q-btn label="löschen" color="red" @click="deleteSbwl(sbwl)" />
            <div class="col-12 row items-center full-height" style="min-height: 250px">
              <div class="col-12 row items-center q-gutter-md">
                <div
                  v-for="subject in sbwl.subjects"
                  class="col-12 col-md-3"
                  style="max-width: 450px"
                  :key="subject.subject_id"
                >
                  <Subject :subject="subject" />
                  <!-- Checkbox wird nur im Auswahlmodus angezeigt -->
                  <q-checkbox
                    v-if="selectionMode"
                    v-model="selectedSubjectsToDelete"
                    :val="subject"
                    label="Wählen"
                  />
                </div>

                <!-- FAB für Hinzufügen oder Löschen -->

                <q-fab color="blue-4" icon="add" direction="right">
                  <q-fab-action color="positive" @click="openAddDialog" icon="add" label="Hinzufügen" />
                  <q-fab-action color="negative" @click="enterSelectionMode" icon="delete" label="Löschen" />
                </q-fab>
              </div>
            </div>

            <!-- Dialog Courses Abroad hinzufügen -->
            <q-dialog v-model="courses_abroad_dialog">
              <q-card style="width: 700px; max-width: 80vw">
                <q-card-section>
                  <div class="text-h6">Wahlfach hinzufügen</div>
                </q-card-section>

                <q-card-section class="row justify-start q-col-gutter-xl q-pt-none">
                  <div class="col-6">
                    <q-input
                      filled
                      v-model="name"
                      type="text"
                      label="Name"
                      hint="Name der Lehrveranstaltung"
                    />
                  </div>
                  <div class="col-6">
                    <q-input filled v-model="ects" type="number" label="ECTS" hint="ECTS-Punkte" />
                  </div>
                </q-card-section>
                <q-card-section class="row justify-start q-gutter-md">
                  <q-btn-dropdown
                    outline
                    :label="'Note: ' + (selectedGrade !== undefined ? selectedGrade : '')"
                  >
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
                          <q-item-label>{{ grade }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn
                    flat
                    color="negative"
                    label="Abbrechen"
                    @click="() => console.log(this.name, this.ects, this.selectedGrade)"
                    v-close-popup
                  />
                  <q-btn
                    flat
                    color="positive"
                    label="Hinzufügen"
                    :disable="isFormIncomplete"
                    @click="selectCoursesAbroad"
                    v-close-popup
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>

            <!-- Buttons zum Löschen und Abbrechen im Auswahlmodus -->
            <div v-if="selectionMode" class="q-mt-md">
              <q-btn
                flat
                color="negative"
                label="Löschen"
                :disable="selectedSubjectsToDelete.length === 0"
                @click="deleteSelectedCourseAbroad"
              />
              <q-btn
                flat
                color="primary"
                label="Abbrechen"
                @click="exitSelectionMode"
                class="q-ml-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user.store'
import Subject from './subject.vue'

export default {
  components: {
    Subject
  },
  props: {
    selectedStudy: {
      type: Object,
      required: true
    },
    sbwlsAvailable: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const userStore = useUserStore()

    return {
      userStore,
      courses_abroad_dialog: ref(false),
      selectionMode: ref(false),
      grades: ref(['1', '2', '3', '4', 'Teilgenommen']),
      name: ref(''),
      ects: ref(),
      selectedGrade: ref(),
      selectedSubjectsToDelete: ref([])
    }
  },
  computed: {
    isFormIncomplete() {
      return !this.name || !this.ects || !this.selectedGrade
    }
  },
  methods: {
    getSbwlLength() {
      const specialCategories = ['Spezielle Betriebswirtschaftslehre', 'Specializations']
      return this.selectedStudy.subject_states.filter((obj) =>
        specialCategories.includes(obj.category)
      )
    },
    updateStatus(subjectId, status, grade, sbwl) {
      this.userStore.updateSbwlSubjectStatus(
        this.selectedStudy.study_id,
        subjectId,
        status,
        grade,
        sbwl
      )
    },
    selectSbwl(sbwl) {
      this.userStore.addSbwlToStudy(this.selectedStudy.study_id, sbwl)
    },
    deleteSbwl(sbwl) {
      this.userStore.deleteSbwlFromStudy(this.selectedStudy.study_id, sbwl)
    },
    selectCoursesAbroad() {
      // Findet die Courses Abroad SBWL und berechnet die nächste ID
      const coursesAbroad = this.selectedStudy.sbwl_states.find(
        (sbwl) => sbwl.sbwl_name === 'Courses Abroad'
      )

      // Berechnet die nächste ID basierend auf der Länge des Subjects-Arrays in Courses Abroad
      const nextId = coursesAbroad ? coursesAbroad.subjects.length + 1 : 1

      const newCourseAbroad = {
        _id: nextId.toString(), // Setzt die ID auf den nächsten Wert
        name: this.name,
        ects: this.ects,
        subject_type: 'SBWL',
        grade: this.selectedGrade,
        status: 'done'
      }
      console.log(newCourseAbroad)
      this.userStore.addCoursesAbroadToStudy(this.selectedStudy.study_id, newCourseAbroad)
    },
    openAddDialog() {
      this.courses_abroad_dialog = true
    },
    enterSelectionMode() {
      this.selectionMode = true
    },
    exitSelectionMode() {
      this.selectionMode = false
      this.selectedSubjectsToDelete = []
    },
    deleteSelectedCourseAbroad() {
      console.log('Zu löschende Wahlfächer:', this.selectedSubjectsToDelete)
      this.userStore.deleteSubjectsFromCourseAbroad(
        this.selectedStudy.study_id,
        this.selectedSubjectsToDelete
      )
      this.selectedSubjectsToDelete = []
      this.exitSelectionMode()
    }
  }
}
</script>

<style></style>
