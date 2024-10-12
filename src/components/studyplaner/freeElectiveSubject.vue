<template>
  <q-card class="my-card">
    <q-card-section style="background-color: rgb(152, 242, 128)">
      <q-badge class="badge">
      <q-btn round color="grey-5" icon="close" style="opacity: 0.8" @click="deleteFreeElective(subject)" />
    </q-badge>
      <div class="text-h6 text-grey-9">{{subject.name}}</div>
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <q-chip outline square>
      {{ subject.subject_type}}
        TYPE
      </q-chip>
      <q-chip outline square>
        {{subject.ects}}
        ECTS
      </q-chip>
      <q-chip outline square>
       {{ subject.grade}}
        GRADE
      </q-chip>
    </q-card-actions>
  </q-card>
</template>

<script>
import { ref } from 'vue'
export default {
  props: {
    subject: {
      type: Object,
      required: true
    }
  },
  setup() {
  },
  methods: {
    deleteFreeElective(subject) {
      this.$emit('delete-free-elective', subject)
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
.badge {
  background-color: transparent;
  position: absolute;
  top: -20px;
  right: -20px;
  z-index: 2;
}
</style>
