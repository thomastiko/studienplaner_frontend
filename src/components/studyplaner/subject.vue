<template>
  <q-card
    class="my-card cursor-pointer"
    :class="{
      selectionMode: selectionMode && !subject.selected,
      disabled:
        selectionMode &&
        (subject.category === 'Free Electives and Internship' ||
          subject.category === 'Specializations' || subject.category === 'Spezielle Betriebswirtschaftslehre' ||
          subject.category === 'Bachelorarbeit')
    }"
  >
  <q-img v-if="subject.status == 'done'" src="@/assets/schleife_award_icon_2.svg" fit="scale-down" height="30px" width="30px" style="position: absolute; right: -10px; top: -5px; z-index: 1;">
    <q-tooltip>
      {{ $t('studyPlan.done_badge') }}
    </q-tooltip>
  </q-img>
  <q-card-section :style="{ backgroundColor: getSubjectColor() }" style="min-height: 100px" @click="toggleSelection">
      <div class="text-h6 text-grey-9" style="user-select: none">{{ subject.name }}</div>
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <div class="truncate-chip-labels">
        <q-chip
        v-if="subject.category !== undefined"
          class="category-chip"
          square
          :style="{ backgroundColor: subject.color }"
          :label="subject.category"
        >
          <q-popup-proxy
            :offset="[-10, 2]"
            :breakpoint="100"
            :style="{ backgroundColor: subject.color }"
          >
            <div class="q-pa-sm text-body1 text-black">{{ subject.category }}</div>
          </q-popup-proxy>
        </q-chip>
        <q-chip outline square :ripple="false" style="cursor: default">
          {{ subject.subject_type }}
        </q-chip>
        <q-chip outline square :ripple="false" style="cursor: default">
          {{ subject.ects }}
          ECTS
        </q-chip>
        <q-chip
          outline
          square
          :ripple="false"
          v-if="
            subject.category !== 'Free Electives and Internship' &&
            subject.category !== 'Specializations' &&
            subject.category !== 'Freies Wahlfach' &&
            subject.category !== 'Spezielle Betriebswirtschaftslehre'
          "
        >
          {{
            subject.grade !== null
              ? `${$t('myStudy.grade')}: ${subject.grade}`
              : $t('myStudy.no_grade')
          }}
        </q-chip>
      </div>
    </q-card-actions>

    <q-card-actions
      v-if="
        subject.category !== 'Free Electives and Internship' &&
        subject.category !== 'Specializations' &&
        subject.category !== 'Freies Wahlfach' &&
        subject.category !== 'Spezielle Betriebswirtschaftslehre' &&
        subject.category !== 'Internationale Erfahrung'
      "
    >
      <q-btn-dropdown
        flat
        label="Status"
        class="full-width"
        v-if="subject.status !== 'unavailable' && !this.selectionMode"
      >
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
    },
    selectionMode: {
      type: Boolean
    }
  },
  emits: ['status-change', 'add-subject-to-cart', 'show-path'],
  setup() {
    const grades = [
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 }
    ]

    return {
      grade: ref(1),
      dialog: ref(false),
      grades,
      truncate: ref(true)
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
        color = '#B3E5FC'
      }

      return color || '#FFFFFF'
    },
    setStatus(status) {
      if (status !== 'done') {
        this.grade = null
      }
      this.$emit('status-change', this.subject._id, status, this.grade)
    },
    toggleSelection() {
      if (this.selectionMode) {
        if (
          this.subject.category !== 'Free Electives and Internship' &&
          this.subject.category !== 'Specializations' &&
          this.subject.category !== 'Bachelorarbeit'
        ) {
          this.subject.selected = !this.subject.selected
          this.$emit('add-subject-to-cart', this.subject)
        }
      } else {
        this.$emit('show-path', this.subject)
      }
    }
  },
  watch: {
    selectionMode: {
      handler(newVal) {
        if (!newVal) {
          if (this.subject.selected) {
            this.subject.selected = false
          }
        }
      },
      immediate: true
    }
  },
  mounted() {}
}
</script>

<style scoped>
.truncate-chip-labels > .q-chip {
  max-width: 80px;
}

.category-chip:hover {
  filter: brightness(0.95);
}
.selectionMode {
  filter: brightness(0.7);
}

.my-card.selectionMode:not(.selected) {
  filter: brightness(0.7);
}

.my-card.selectionMode.selected {
  filter: brightness(1);
}
.disabled {
  pointer-events: none; /* Verhindert Klicks */
  cursor: not-allowed; /* Zeigt an, dass die Karte nicht klickbar ist */
  opacity: 0.6; /* Optional: Reduziert die Sichtbarkeit für visuelles Feedback */
}
</style>
