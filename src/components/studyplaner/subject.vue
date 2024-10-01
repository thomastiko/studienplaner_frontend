<template>
  <q-card class="my-card">
    <q-card-section :style="{ backgroundColor: getSubjectColor() }">
      <div class="text-h6 text-grey-9">{{ subject.name }}</div>
      <div class="text-subtitle2">{{ subject.category }}</div>
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <q-chip outline square>
        {{ subject.subject_type }}
        TYPE
      </q-chip>
      <q-chip outline square>
        {{ subject.ects }}
        ECTS
      </q-chip>
      <q-chip outline square clickable>
        {{ subject.grade || model }}
        <div>Grade</div>
        <q-popup-edit v-model="model">
          <div v-close-popup v-for="grade in grades" :key="grade">
            <q-btn @click="model = grade" flat :label="grade" />
          </div>
        </q-popup-edit>
      </q-chip>
    </q-card-actions>

    <q-card-actions>
      <q-btn-dropdown flat label="Status" class="full-width">
        <q-list>
          <q-item clickable v-close-popup @click="setStatus('can-do')">
            <q-item-section>
              <q-item-label>Undo</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="setStatus('doing')">
            <q-item-section>
              <q-item-label>Doing</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="setStatus('done')">
            <q-item-section>
              <q-item-label>Done</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
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
    const grades = [1, 2, 3, 4, 5]

    return {
      model: ref(null),
      grades
    }
  },
  methods: {
    getSubjectColor() {
      let color = this.subject.color
      if (this.subject.status == 'unavailable') {
        color = '#D9D9D9'
      } else if (this.subject.status == 'done') {
        color = '#98F280'
      } else if (this.subject.status == 'doing') {
        color = '#FFA03D'
      } else {
        color = this.subject.color
      }
      return color || '#FFFFFF'
    },
    setStatus(status) {
      this.$emit('status-change', this.subject._id, status)
    }
  },
  mounted() {
    console.log(this.subject)
  }
}
</script>

<style></style>
