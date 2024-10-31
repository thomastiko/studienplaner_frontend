<template>
  <q-card class="my-card cursor-pointer">
    <q-card-section :style="{ backgroundColor: getSubjectColor() }" :draggable="true" @dragstart="handleDragStart($event, subject)" @dragend="handleDragEnd">
      <div class="text-h6 text-grey-9" style="user-select: none">{{ subject.name }}</div>
      <div class="text-subtitle2" style="user-select: none">{{ subject.category }}</div>
    </q-card-section>

    <q-separator />

    <q-card-actions style="cursor: default;">
      <q-chip outline square>
        {{ subject.subject_type }}
        TYPE
      </q-chip>
      <q-chip outline square>
        {{ subject.ects }}
        ECTS
      </q-chip>
      <q-chip outline square>
        {{ subject.grade }}
        GRADE
      </q-chip>
    </q-card-actions>

    <q-card-actions v-if="subject.subject_type !== 'ANY' && subject.subject_type !== 'SBWL'">
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

          <q-item clickable v-close-popup @click="dialog = true">
            <q-item-section>
              <q-item-label>Done</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-card-actions>
  </q-card>

  <!-- Dialog nachdem der Status auf "done" geändert werden will -->
  <q-dialog v-model="dialog" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">Gratuliere!</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Du hast das Fach <strong>{{ this.subject.name }}</strong> erfolgreich abgeschlossen. Bitte
        gib deine Note an:
      </q-card-section>
      <q-card-section>
        <q-option-group v-model="grade" :options="grades" color="primary" inline />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="OK" color="primary" @click="setStatus('done')" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
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
  emits: ['status-change', 'handle-drag-start', 'drag', 'dragend'],
  setup() {
    const grades = [{ label: "1", value: 1 }, { label: "2", value: 2 }, { label: "3", value: 3 }, { label: "4", value: 4 }]

    return {
      grade: ref(1),
      dialog: ref(false),
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
      if (status !== 'done') {
        this.grade = null
      }
      this.$emit('status-change', this.subject._id, status, this.grade)
    },
    handleDragStart($event, subject) {
      this.$emit("handle-drag-start", $event, subject);
    },
    handleDragEnd() {
      this.$emit("dragend");
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
