<template>
  <div>
    <div class="shadow-1 q-ma-md">
      <div class="q-pa-md row q-col-gutter-md items-stretch">
        <div class="col-12 row justify-between items-center">
          <div class="text-h5 text-bold text-uppercase">SBWLs</div>
          <div>{{ getSbwlLength().length }} SBWLs</div>
        </div>
      </div>

      <!-- SBWLs Buttons for all Studys except BBE -->
      <div v-if="this.selectedStudy.study_id !== 'bbe'">
        <div class="q-pa-sm row" v-for="(sbwl, i) in getSbwlLength()" :key="i">
          <div class="col-12 row">
            <q-btn-dropdown
              color="blue-7"
              :label="`${i + 1} SBWL hinzufügen`"
              dropdown-icon="add_circle"
              :disable="!this.sbwlsAvailable || this.selectedStudy.sbwl_states.length !== i"
            >
              <q-item
                clickable
                v-close-popup
                v-for="(filteredSbwl, j) in this.getSbwlList(sbwl)"
                :key="j"
                @click="selectSbwl(filteredSbwl)"
              >
                <q-item-section>
                  <q-item-label
                    >{{ filteredSbwl.name }}
                    <span v-if="filteredSbwl.ects">
                      - {{ filteredSbwl.ects }} Ects</span
                    ></q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-btn-dropdown>
          </div>
        </div>
      </div>

      <!-- SBWLs Buttons for BBE -->
      <div v-else>
      <div class="q-pa-sm row" v-for="(sbwl, i) in 4" :key="i">
        <div class="col-12 row">
          <q-btn-dropdown
            color="blue-7"
            :label="`${i + 1} SBWL hinzufügen`"
            dropdown-icon="add_circle"
            :disable="!this.sbwlsAvailable || this.isButtonDisabled(i)"
          >
            <q-item
              clickable
              v-close-popup
              v-for="(filteredSbwl, j) in this.getBbeSbwlList(sbwl)"
              :key="j"
              @click="selectSbwl(filteredSbwl)"
            >
              <q-item-section>
                <q-item-label
                  >{{ filteredSbwl.name }}
                  <span v-if="filteredSbwl.ects">
                    - {{ filteredSbwl.ects }} Ects</span
                  ></q-item-label
                >
              </q-item-section>
            </q-item>
          </q-btn-dropdown>
        </div>
      </div>
      </div>

      <div class="col-12 row q-ma-md">
        <div v-for="(sbwl, i) in selectedStudy.sbwl_states" :key="i" class="col-12 q-pb-md">
          <!-- SBWLS -->
          <div
            v-if="
              sbwl.sbwl_name !== 'Courses Abroad' && sbwl.sbwl_name !== 'Internationale Erfahrung'
            "
          >
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
                  <q-fab-action
                    color="positive"
                    @click="openAddDialog"
                    icon="add"
                    label="Hinzufügen"
                  />
                  <q-fab-action
                    color="negative"
                    @click="enterSelectionMode"
                    icon="delete"
                    label="Löschen"
                  />
                </q-fab>
              </div>
            </div>

            <!-- Dialog Courses Abroad hinzufügen -->
            <q-dialog v-model="courses_abroad_dialog">
              <q-card style="width: 700px; max-width: 80vw">
                <q-card-section>
                  <div class="text-h6">Auslandssemester Kurs</div>
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
import { useQuasar } from 'quasar'

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
    const q = useQuasar()

    return {
      userStore,
      courses_abroad_dialog: ref(false),
      selectionMode: ref(false),
      grades: ref(['1', '2', '3', '4', 'Teilgenommen']),
      name: ref(''),
      ects: ref(),
      selectedGrade: ref(),
      selectedSubjectsToDelete: ref([]),
      q
    }
  },
  computed: {
    isFormIncomplete() {
      return !this.name || !this.ects || !this.selectedGrade
    }
  },
  methods: {
    getSbwlLength() {
      const specialCategories = [
        'Spezielle Betriebswirtschaftslehre',
        'Specializations',
        'Internationale Erfahrung'
      ]
      return this.selectedStudy.subject_states.filter((obj) =>
        specialCategories.includes(obj.category)
      )
    },
    getSbwlList(sbwl) {
      // Wenn der Name "Courses Abroad" enthält, zeige die gesamte sbwl_list an
      if (
        (sbwl.name && sbwl.name.includes('Courses Abroad')) ||
        sbwl.name.includes('Internationale Erfahrung')
      ) {
        return this.selectedStudy.sbwl_list
      }
      // Andernfalls zeige nur die gefilterten sbwl_list-Einträge ohne "Courses Abroad" an
      return this.selectedStudy.sbwl_list.filter(
        (item) =>
          !item.name.includes('Courses Abroad') || sbwl.name.includes('Internationale Erfahrung')
      )
    },
    getBbeSbwlList() {
      // Berechne die bereits gewählten ECTS-Punkte
      const totalEcts = this.selectedStudy.sbwl_states.reduce(
        (sum, sbwl) => sum + (sbwl.ects || 0),
        0
      )
      const remainingEcts = 40 - totalEcts

      // Wenn noch 20 oder mehr ECTS offen sind, alle SBWLs anzeigen
      if (remainingEcts >= 20) {
        return this.selectedStudy.sbwl_list
      }

      // Wenn nur noch 10 ECTS offen sind, nur SBWLs mit 10 ECTS anzeigen
      if (remainingEcts === 10) {
        return this.selectedStudy.sbwl_list.filter((sbwl) => sbwl.ects === 10)
      }

      // Wenn keine ECTS mehr offen sind, leere Liste zurückgeben, um die Auswahl zu deaktivieren
      return []
    },
    isButtonDisabled(index) {
    const totalEcts = this.selectedStudy.sbwl_states.reduce((sum, sbwl) => sum + (sbwl.ects || 0), 0);
    const remainingEcts = 40 - totalEcts;

    // Deaktiviere den Button, wenn nicht alle vorherigen SBWLs ausgewählt wurden oder wenn keine ECTS mehr übrig sind
    if (this.selectedStudy.sbwl_states.length !== index) {
      return true;
    }

    // Wenn der dritte Button gedrückt wird, stelle sicher, dass es passende SBWLs gibt
    if (index >= 2 && remainingEcts < 10) {
      return true;
    }

    return remainingEcts <= 0;
  },
    updateStatus(subjectId, status, grade, sbwl) {
      this.userStore.updateSbwlSubjectStatus(
        this.selectedStudy.study_id,
        subjectId,
        status,
        grade,
        sbwl,
        this.q.notify
      )
    },
    selectSbwl(sbwl) {
      this.userStore.addSbwlToStudy(this.selectedStudy.study_id, sbwl, this.q.notify)
    },
    deleteSbwl(sbwl) {
      console.log('Zu löschende SBWL:', sbwl)
      if (
        this.selectedStudy.sbwl_states.some(
          (state) =>
            (state.sbwl_name === 'Courses Abroad' && sbwl.sbwl_name !== 'Courses Abroad') ||
            (state.sbwl_name === 'Internationale Erfahrung' &&
              sbwl.sbwl_name !== 'Internationale Erfahrung')
        )
      ) {
        this.userStore.deleteEverySbwlFromStudy(this.selectedStudy.study_id)
      } else {
        this.userStore.deleteSbwlFromStudy(this.selectedStudy.study_id, sbwl, this.q.notify)
      }
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
      this.userStore.addCoursesAbroadToStudy(this.selectedStudy.study_id, newCourseAbroad, this.q.notify)
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
        this.selectedSubjectsToDelete,
        this.q.notify
      )
      this.selectedSubjectsToDelete = []
      this.exitSelectionMode()
    }
  }
}
</script>

<style></style>
