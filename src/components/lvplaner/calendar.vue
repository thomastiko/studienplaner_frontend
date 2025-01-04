<template>
  <div class="subcontent">
    <!--<div class="text-h5 text-center text-weight-medium q-mb-lg">
      {{ $t('lvPlaner.my_calendar') }}
    </div>-->
    <div class="col-12 row justify-center shadow-1">
      <div class="col-12">
        <div class="row text-blue-7 bg-white q-pa-sm">
          <!-- Linke Spalte (bis "Download Calendar") -->
          <div
            :class="[
              'col-12 col-md-6 col-lg-6 row items-center',
              { 'justify-center': $q.screen.lt.md }
            ]"
          >
            <q-btn flat icon="navigate_before" color="blue-7" @click="onPrev" />
            <div class="q-ma-xs">{{ formattedMonth }}</div>
            <q-btn flat icon="navigate_next" color="blue-7" @click="onNext" />
            <q-btn flat :label="$t('lvPlaner.today')" @click="onToday" />
            <q-btn
              v-if="$q.screen.lt.md"
              no-caps
              size="sm"
              icon="download"
              color="primary"
              @click="(openDownloadDialog = true), selectAllCourses()"
            />
            <q-btn
              v-else
              no-caps
              :label="$t('lvPlaner.download_calendar')"
              color="primary"
              @click="(openDownloadDialog = true), selectAllCourses()"
            />
            <q-dialog v-model="openDownloadDialog">
              <q-card>
                <q-card-section>
                  <div class="text-h6">{{ $t('lvPlaner.download_calendar_dialog') }}:</div>
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
                  <q-btn no-caps flat :label="$t('lvPlaner.cancel')" color="red-4" v-close-popup />
                  <q-btn
                    no-caps
                    flat
                    :label="$t('lvPlaner.download')"
                    color="primary"
                    v-close-popup
                    @click="downloadICalFeed"
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
          <!-- Rechte Spalte (Meine Kurse und Ansicht) -->
          <div
            :class="[
              'col-12 col-md-6 col-lg-6 row items-center justify-end',
              { 'justify-end': !$q.screen.lt.md, 'justify-center': $q.screen.lt.md }
            ]"
          >
            <q-btn-dropdown flat :label="$t('lvPlaner.my_courses')">
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

            <q-btn-dropdown flat :label="$t('lvPlaner.view')">
              <q-list>
                <q-item clickable v-close-popup @click="() => updateSelected('day', 'week')">
                  <q-item-section>
                    <q-item-label> {{ $t('lvPlaner.week') }} </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="() => updateSelected('month', 'day')">
                  <q-item-section>
                    <q-item-label>{{ $t('lvPlaner.month') }}</q-item-label>
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
          :locale="locale"
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
              <q-badge
                class="cursor-pointer"
                align="middle"
                multi-line
                :style="{ backgroundColor: event.color }"
              >
                <div class="col-12 row">
                  {{ event.name || event.subject_name }}
                </div>

                <q-popup-proxy>
                  <div v-if="showCourse(event)">
                    <q-card
                      style="max-width: 400px"
                      class="shadow-1"
                      default-opened
                      header-class="text-grey-8"
                    >
                      <q-card-section>
                        <q-item-section>
                          <div class="col-12 row">
                            <div class="col-12 row items-center">
                              {{ showCourse(event).name }}
                              <span class="text-bold q-ml-xs"
                                >({{ showCourse(event).course_code }})</span
                              >
                            </div>
                          </div>
                        </q-item-section>
                      </q-card-section>
                      <q-separator />
                      <!-- Restlicher Inhalt des q-expansion-item -->
                      <div class="row q-pa-sm">
                        <div class="col-12 row items-center text-body2">
                          <div class="q-pr-xs text-blue-7">Prof:</div>
                          <div
                            v-for="prof in showCourse(event).taught_bys"
                            :key="prof"
                            class="q-mr-xs"
                          >
                            {{ prof.firstName }} {{ prof.lastName }},
                          </div>
                        </div>
                        <q-separator />
                        <div class="col-12 text-blue-7 text-body2">
                          {{ $t('lvPlaner.mode') }}:
                          <span class="text-grey-8">{{ showCourse(event).mode }}</span>
                        </div>
                        <div class="col-12 text-blue-7 text-body2">
                          {{ $t('lvPlaner.language') }}:
                          <span class="text-grey-8">{{ showCourse(event).language }}</span>
                        </div>
                        <div class="text-blue-7">
                          <a
                            :href="showCourse(event).vvz_url"
                            target="_blank"
                            class="text-blue-7 text-body2"
                            >{{ $t('lvPlaner.to_vvz') }}</a
                          >
                        </div>
                      </div>
                      <q-separator />
                      <div class="text-blue-7 text-body2 q-pl-sm q-pt-sm">
                        {{ $t('lvPlaner.dates') }}:
                      </div>
                      <q-list separator>
                        <q-item
                          v-for="(date, i) in showCourse(event).dates"
                          :key="i"
                          dense
                          :class="{
                            'bg-blue-2 shadow-1': event.start === date.start && event.end === date.end
                          }"
                        >
                          <div class="q-mr-xs">{{ formatDateRange(date.start, date.end) }},</div>
                          <div>
                            <template v-if="date.location_url">
                              <a
                                :href="date.location_url"
                                target="_blank"
                                class="text-blue-7 text-body2"
                              >
                                {{ date.location }}
                              </a>
                            </template>
                            <template v-else>
                              <span v-if="date.location" class="text-body2 text-blue-7">{{ date.location }}</span>
                            </template>
                          </div>
                        </q-item>
                      </q-list>
                    </q-card>
                  </div>
                </q-popup-proxy>
              </q-badge>
            </template>
          </template>

          <template #day-body="{ scope: { timestamp, timeStartPos, timeDurationHeight } }">
            <template v-for="event in getEvents(timestamp.date)" :key="event._id || event.id">
              <q-badge
                v-if="event.start && event.duration"
                multi-line
                class="my-event justify-center ellipsis cursor-pointer"
                :style="badgeStyles(event, 'day', timeStartPos, timeDurationHeight)" style="white-space: normal"
              >
              <div class="col-12 row">
                  {{ event.name || event.subject_name }}
                </div>
                <q-popup-proxy>
                  <div v-if="showCourse(event)">
                    <q-card
                      style="max-width: 400px"
                      class="shadow-1"
                      default-opened
                      header-class="text-grey-8"
                    >
                      <q-card-section>
                        <q-item-section>
                          <div class="col-12 row">
                            <div class="col-12 row items-center">
                              {{ showCourse(event).name }}
                              <span class="text-bold q-ml-xs"
                                >({{ showCourse(event).course_code }})</span
                              >
                            </div>
                          </div>
                        </q-item-section>
                      </q-card-section>
                      <q-separator />
                      <!-- Restlicher Inhalt des q-expansion-item -->
                      <div class="row q-pa-sm">
                        <div class="col-12 row items-center text-body2">
                          <div class="q-pr-xs text-blue-7">Prof:</div>
                          <div
                            v-for="prof in showCourse(event).taught_bys"
                            :key="prof"
                            class="q-mr-xs"
                          >
                            {{ prof.firstName }} {{ prof.lastName }},
                          </div>
                        </div>
                        <q-separator />
                        <div class="col-12 text-blue-7 text-body2">
                          {{ $t('lvPlaner.mode') }}:
                          <span class="text-grey-8">{{ showCourse(event).mode }}</span>
                        </div>
                        <div class="col-12 text-blue-7 text-body2">
                          {{ $t('lvPlaner.language') }}:
                          <span class="text-grey-8">{{ showCourse(event).language }}</span>
                        </div>
                        <div class="text-blue-7">
                          <a
                            :href="showCourse(event).vvz_url"
                            target="_blank"
                            class="text-blue-7 text-body2"
                            >{{ $t('lvPlaner.to_vvz') }}</a
                          >
                        </div>
                      </div>
                      <q-separator />
                      <div class="text-blue-7 text-body2 q-pl-sm q-pt-sm">
                        {{ $t('lvPlaner.dates') }}:
                      </div>
                      <q-list separator>
                        <q-item
                          v-for="(date, i) in showCourse(event).dates"
                          :key="i"
                          dense
                          :class="{
                            'bg-blue-2 shadow-1': event.start === date.start && event.end === date.end
                          }"
                        >
                          <div class="q-mr-xs">{{ formatDateRange(date.start, date.end) }},</div>
                          <div>
                            <template v-if="date.location_url">
                              <a
                                :href="date.location_url"
                                target="_blank"
                                class="text-blue-7 text-body2"
                              >
                                {{ date.location }}
                              </a>
                            </template>
                            <template v-else>
                              <span v-if="date.location" class="text-body2 text-blue-7">{{ date.location }}</span>
                            </template>
                          </div>
                        </q-item>
                      </q-list>
                    </q-card>
                  </div>
                </q-popup-proxy>
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
import { useI18n } from 'vue-i18n'

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
    const { locale, t } = useI18n({ useScope: 'global' })

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
      t,
      locale,
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
      formatTime,
      formatDateRange(dateStart, dateEnd) {
        // Konvertiere die Eingaben zu Date-Objekten
        const start = new Date(dateStart)
        const end = new Date(dateEnd)

        // Überprüfe, ob das Format korrekt ist
        if (isNaN(start) || isNaN(end)) {
          return 'Invalid Date'
        }

        // Optionen für das Formatieren des Datums
        const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false }

        // Formatieren des Startdatums
        const formattedDate = start.toLocaleDateString('de-DE', dateOptions)
        const formattedStartTime = start.toLocaleTimeString('de-DE', timeOptions)
        const formattedEndTime = end.toLocaleTimeString('de-DE', timeOptions)

        // Zusammenfügen der Ergebnisse
        return `${formattedDate}, ${formattedStartTime} - ${formattedEndTime}`
      }
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
              name: event.name,
              subject_name: event.subject_name,
              course_code: event.course_code,
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
    },
    showCourse(event) {
      return this.userStore.user.course_entries.find(
        (course) => course.course_code === event.course_code
      )
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
