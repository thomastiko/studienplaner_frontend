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
          <q-btn-dropdown color="blue-7" label="SBWLs hinzufügen" dropdown-icon="add_circle">
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
                  <span v-if="sbwl.ects"> - {{ sbwl.ects }} Ects </span>
                </q-item-label>
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
                </div>
                <q-btn round icon="add" color="blue-7" @click="this.courses_abroad_dialog = true" />
              </div>
            </div>

            <!-- Dialog Courses Abroad -->
            <q-dialog v-model="courses_abroad_dialog">
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
                    @click="selectCoursesAbroad"
                    v-close-popup
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.store'
//import SbwlSubject from './sbwlSubject.vue'
import Subject from './subject.vue'
export default {
  components: {
    //SbwlSubject,
    Subject
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
      courses_abroad_dialog: ref(false),
      grades: ref(['1', '2', '3', '4', 'Teilgenommen']),
      subject_types: ref(['LVP', 'VUE', 'PI', 'Any']),
      name: ref(''),
      ects: ref(),
      selectedType: ref(''),
      selectedGrade: ref()
    }
  },
  methods: {
    getSbwlLength() {
      const specialCategories = ['Spezielle Betriebswirtschaftslehre', 'Specializations']

      return this.selectedStudy.subject_states.filter((obj) => {
        return specialCategories.includes(obj.category)
      })
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
      const coursesAbroad = {
        _id: "1",
        name: this.name,
        ects: this.ects,
        subject_type: "SBWL",
        grade: this.selectedGrade,
        status: 'done',
      }
      console.log(coursesAbroad)
      this.userStore.addCoursesAbroadToStudy(this.selectedStudy.study_id, coursesAbroad)
    }
  },
  mounted() {}
}
</script>

<style></style>
