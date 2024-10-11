<template>
  <div>
    <div class="shadow-1 q-ma-md">
      <div class="q-pa-md row q-col-gutter-md items-stretch">
        <div class="col-12 row justify-between items-center">
          <div class="text-h5 text-bold text-uppercase">SBWLs</div>
          <div>14 Lehrveranstalungen</div>
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
      <div class="col-12 row">
        <div v-for="(sbwl, i) in selectedStudy.sbwl_states" :key="i" class="col-12">
          <div class="text-h5">{{ sbwl.sbwl_name }}</div>
          <q-btn label="löschen" color="red" @click="deleteSbwl(sbwl)" />
          <div class="col-12 row q-col-gutter-md">
          <div v-for="subject in sbwl.subjects" class="col-12 col-md-3"
            style="max-width: 450px" :key="subject.subject_id">
            <Subject :subject="subject" />
          </div>
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
    Subject,
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
      userStore
    }
  },
  methods: {
    getSbwlLength() {
      const specialCategories = ['Spezielle Betriebswirtschaftslehre', 'Specializations']

      return this.selectedStudy.subject_states.filter((obj) => {
        return specialCategories.includes(obj.category)
      })
    },
    selectSbwl(sbwl) {
      this.userStore.addSbwlToStudy(this.selectedStudy.study_id, sbwl)
    },
    deleteSbwl(sbwl) {
        this.userStore.deleteSbwlFromStudy(this.selectedStudy.study_id, sbwl)
    }
  },
  mounted() {}
}
</script>

<style></style>
