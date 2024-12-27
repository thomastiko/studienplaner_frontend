<template>
  <div class="subcontent">
    <!--<div class="text-h5 text-center text-weight-medium q-mb-lg">
      {{ $t('lvPlaner.my_calendar') }}
    </div>-->
    <div class="col-12 row justify-center shadow-1">
      <div class="col-12">
        <div class="row text-blue-7 bg-white q-pa-sm">
          <!-- Linke Spalte (bis "Heute") -->
          <div
            :class="[
              'col-12 col-md-6 col-lg-4 row items-center',
              { 'justify-center': $q.screen.lt.md }
            ]"
          >
            <q-btn flat icon="navigate_before" color="blue-7" @click="onPrev" />
            <div class="q-ma-xs">{{ formattedMonth }}</div>
            <q-btn flat icon="navigate_next" color="blue-7" @click="onNext" />
            <q-btn flat label="Heute" @click="onToday" />
          </div>

          <!-- Mittlere Spalte (Kalender herunterladen) -->
          <div class="col-12 col-md-6 col-lg-4 row items-center justify-center">
            <q-btn
              :label="'Kalender herunterladen'"
              color="primary"
              @click="(openDownloadDialog = true), selectAllCourses()"
            />
            <q-dialog v-model="openDownloadDialog">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Kalender-Download - LV auswählen</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <div v-for="(course, i) in this.userStore.user.course_entries" :key="i">
                    <q-checkbox
                      :label="course.subject_name"
                      v-model="checkbox"
                      :val="course.subject_name"
                    />
                  </div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="Abbrechen" color="red-4" v-close-popup />
                  <q-btn flat label="OK" color="primary" v-close-popup @click="downloadICalFeed" />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>

          <!-- Rechte Spalte (Meine Kurse und Ansicht) -->
          <div
            :class="[
              'col-12 col-md-6 col-lg-4 row items-center',
              { 'justify-end': !$q.screen.lt.md, 'justify-center': $q.screen.lt.md }
            ]"
          >
            <q-btn-dropdown flat label="Meine Kurse">
              <q-list separator style="position: relative; z-index: 3">
                <q-item v-for="(course, i) in this.userStore.user.course_entries" :key="i">
                  <q-item-section avatar>
                    <q-btn-dropdown
                      :style="{
                        backgroundColor: course.color || 'lightblue',
                        border: '2px solid lightgray'
                      }"
                      padding="none"
                      rounded
                      auto-close
                      dropdown-icon="none"
                      :direction="setDirection"
                      text-color="white"
                    >
                      <q-color
                        no-footer
                        no-header
                        default-view="palette"
                        :palette="[
                          '#ffcc5c',
                          '#f2774e',
                          '#d9534f',
                          '#f6a6b2',
                          '#d76b78',
                          '#6b353c',
                          '#adcbe3',
                          '#5bbdf4',
                          '#4b86b4',
                          '#2e4c5c',
                          '#a4d4a3',
                          '#52bf90',
                          '#36802d',
                          '#234d20',
                          '#d0b783',
                          '#967259',
                          '#6f4d37',
                          '#bfb5b2',
                          '#86949f',
                          '#5d5c61'
                        ]"
                        class="my-picker"
                        @change="changeColor(course, $event)"
                      />
                    </q-btn-dropdown>
                  </q-item-section>
                  <q-item-section>
                    <div class="col-12 row">
                      <div class="col-12 row items-center">
                        {{ course.name }}
                        <span class="text-weight-bold q-ml-xs">({{ course.course_code }})</span>
                      </div>
                    </div>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn icon="delete" flat color="negative" @click.stop="deleteCourse(course)" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>

            <q-btn-dropdown flat label="Ansicht">
              <q-list>
                <q-item clickable v-close-popup @click="() => updateSelected('day', 'week')">
                  <q-item-section>
                    <q-item-label>Woche</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="() => updateSelected('month', 'day')">
                  <q-item-section>
                    <q-item-label>Monat</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>

        <q-calendar
          ref="calendar"
          v-model="selectedDate"
          :mode="selectedCalendar"
          :view="selectedView"
          bordered
          animated
          locale="de-DE"
          day-min-height="120"
          hoverable
          focusable
          :weekdays="[1, 2, 3, 4, 5, 6, 0]"
          :interval-start="6"
          :interval-count="18"
          :interval-height="40"
          style="width: 100%"
        >
          <template #day="{ scope: { timestamp } }">
            <template v-for="event in eventsMap[timestamp.date]" :key="event._id || event.id">
              <q-badge align="middle" multi-line :style="{ backgroundColor: event.color }">
                <div class="col-12 row">
                  {{ event.subject_name }}
                </div>
                <q-tooltip>
                  <div>
                    <span style="text-decoration: underline">Ort:</span> {{ event.location }}
                  </div>
                  <div>
                    <span style="text-decoration: underline">Uhrzeit:</span>
                    {{ formatTime(event.start) }} - {{ formatTime(event.end) }}
                  </div>
                </q-tooltip>
              </q-badge>
            </template>
          </template>

          <template #day-body="{ scope: { timestamp, timeStartPos, timeDurationHeight } }">
            <template v-for="event in getEvents(timestamp.date)" :key="event._id || event.id">
              <q-badge
                v-if="event.start && event.duration"
                class="my-event justify-center ellipsis"
                :style="badgeStyles(event, 'day', timeStartPos, timeDurationHeight)"
              >
                <div class="row col-12 text-caption">
                  {{ event.subject_name }}
                </div>
                <q-tooltip>
                  <div>
                    <span style="text-decoration: underline">Name:</span> {{ event.subject_name }}
                  </div>
                  <div>
                    <span style="text-decoration: underline">Ort:</span> {{ event.location }}
                  </div>
                  <div>
                    <span style="text-decoration: underline">Uhrzeit:</span>
                    {{ formatTime(event.start) }} - {{ formatTime(event.end) }}
                  </div>
                </q-tooltip>
              </q-badge>
            </template>
          </template>
        </q-calendar>
      </div>
    </div>
  </div>
</template>

<script>
import { QCalendar, today } from '@quasar/quasar-ui-qcalendar/src/index.js'
import { defineComponent, ref, computed } from 'vue'
import { useUserStore } from '@/stores/user.store'

export default defineComponent({
  name: 'CalendarComponent',
  components: {
    QCalendar
  },
  setup() {
    const monthFormatter = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' })
    const selectedDate = ref(today())
    const calendar = ref(null)
    const selectedCalendar = ref('month')
    const selectedView = ref('day')
    const userStore = useUserStore()
    const openDownloadDialog = ref(false)
    const checkbox = ref([])

    const deleteCourse = async (course) => {
      try {
        await userStore.deleteCourse(course.course_code, course.semester)
        // Optional: Benutzer über den Erfolg informieren oder die Benutzeroberfläche aktualisieren
      } catch (error) {
        console.error('Fehler beim Löschen des Kurses:', error)
        // Optional: Fehlerbehandlung, z.B. Benachrichtigung anzeigen
      }
    }
    const changeColor = async (course, newColor) => {
      try {
        // Update the color in the local state
        course.color = newColor

        // Call the userStore method to update the color in the backend
        await userStore.updateCourseColor(course.course_code, course.semester, newColor)
      } catch (error) {
        console.error('Fehler beim Ändern der Farbe:', error)
        // Optionally, show an error message to the user
      }
    }

    function onToday() {
      calendar.value?.moveToToday()
    }

    function selectAllCourses() {
      checkbox.value = userStore.user.course_entries.map((course) => course.subject_name)
    }

    function downloadICalFeed() {
      const iCalData = convertToICalFormat(userStore.user.course_entries)
      const blob = new Blob([iCalData], { type: 'text/calendar' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = 'mein_kalender.ics'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }

    function convertToICalFormat(calendarData) {
      let iCalString = 'BEGIN:VCALENDAR\nVERSION:2.0\nMETHOD:PUBLISH\n'
      calendarData.forEach((course) => {
        if (checkbox.value.includes(course.subject_name)) {
          course.dates.forEach((date) => {
            const startDate = new Date(date.start)
            const endDate = new Date(date.end)
            const startDateFormat = formatICalDate(startDate)
            const endDateFormat = formatICalDate(endDate)
            iCalString += `BEGIN:VEVENT\nSUMMARY:${
              course.subject_name
            }\nDTSTART;TZID=Europe/Vienna:${startDateFormat}\nDTEND;TZID=Europe/Vienna:${endDateFormat}\nDTSTAMP;VALUE=DATE-TIME:${formatICalDate(
              new Date()
            )}\nUID:${generateUID()}\nLOCATION:${date.location}\nEND:VEVENT\n`
          })
        }
      })
      iCalString += 'END:VCALENDAR'
      return iCalString
    }

    function formatICalDate(date) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')
      return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
    }

    function generateUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }

    const formattedMonth = computed(() => monthFormatter.format(new Date(selectedDate.value)))

    function onPrev() {
      calendar.value?.move(-1)
    }

    function onNext() {
      calendar.value?.move(1)
    }

    function formatTime(dateTime) {
      const date = new Date(dateTime)
      return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false })
    }

    function getEvents(dt) {
      const events = this.eventsMap[dt] || []
      events.forEach((event) => {
        if (event.start && event.end) {
          const startTime = new Date(event.start)
          const endTime = new Date(event.end)
          event.duration = (endTime - startTime) / (1000 * 60) // Duration in minutes
        }
      })
      return events
    }

    function badgeStyles(event, type, timeStartPos, timeDurationHeight) {
      const s = {}
      if (timeStartPos && timeDurationHeight && event.start && event.duration) {
        const startDate = new Date(event.start)
        s.top = timeStartPos(startDate.getHours() * 60 + startDate.getMinutes()) + 'px'
        s.height = timeDurationHeight(event.duration) + 'px'
        s['background-color'] = event.color || 'lightblue'
        s['align-items'] = 'flex-start'
      }
      return s
    }

    return {
      deleteCourse,
      changeColor,
      selectedDate,
      calendar,
      selectedCalendar,
      selectedView,
      onToday,
      onPrev,
      onNext,
      formattedMonth,
      userStore,
      openDownloadDialog,
      checkbox,
      selectAllCourses,
      downloadICalFeed,
      getEvents,
      badgeStyles,
      formatTime
    }
  },
  computed: {
    eventsMap() {
      let map = {}
      let events = this.userStore.user?.course_entries || []
      events.forEach((event) => {
        event.dates.forEach((date) => {
          try {
            // Calculate the duration from start to end time
            let startTime = new Date(date.start)
            let endTime = new Date(date.end)
            let duration = (endTime - startTime) / (1000 * 60) // Duration in minutes

            date.duration = duration

            // Extrahiere das Datum
            let dateTransformed = date.start.substring(0, date.start.indexOf('T'))

            if (!map[dateTransformed]) {
              map[dateTransformed] = []
            }

            map[dateTransformed].push({
              ...date,
              subject_name: event.subject_name,
              color: event.color
            })
          } catch (error) {
            console.error('Fehler in eventsMap:', error, 'bei date:', date)
          }
        })
      })
      return map
    },
    setDirection() {
      return this.$q.platform.is.desktop ? 'left' : 'right'
    }
  },
  methods: {
    updateSelected(calendar, view) {
      this.selectedCalendar = calendar
      this.selectedView = view
    }
  },
  async mounted() {
    try {
      await this.userStore.fetchUser()
    } catch (error) {
      console.log(error)
    }
  }
})
</script>

<style scoped>
.q-badge--multi-line {
  word-break: normal;
  overflow: hidden;
}
.my-event {
  width: 100%;
  position: absolute;
  border: solid lightgray 1px;
}

.my-picker :deep(.q-color-picker__cube) {
  width: 32px; /* Erhöhte Standardgröße */
  height: 32px;
  margin: 4px; /* Optional: Abstand zwischen den Cubes anpassen */
  transition: transform 0.2s;
}

.my-picker :deep(.q-color-picker__cube:hover) {
  transform: scale(1.2); /* Beim Hover noch größer machen */
  z-index: 1;
}
</style>
