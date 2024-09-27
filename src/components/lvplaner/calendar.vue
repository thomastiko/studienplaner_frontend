<template>
  <div class="subcontent">
    <div class="col-12 row justify-center q-ma-sm shadow-1">
      <div class="col-12">
        <q-toolbar class="text-blue-7 bg-white">
          <q-btn flat :label="$t('lvplaner.calendar_today')" @click="onToday" />
          <q-space />
          <q-btn
            v-if="!this.$q.platform.is.mobile"
            :label="$t('lvplaner.calendar_download_button')"
            color="primary"
            @click="(openDownloadDialog = true), selectAllCourses()"
          />
          <q-dialog v-model="openDownloadDialog">
            <q-card>
              <q-card-section>
                <div class="text-h6">{{ $t("lvplaner.calendar_download_select_lv")}}</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div v-for="(course, i) in this.lvStore.calendar" :key="i">
                  <q-checkbox
                    :label="course.name"
                    v-model="checkbox"
                    :val="course.name"
                  />
                </div>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat :label="$t('common.cancel_button')" color="red-4" v-close-popup />
                <q-btn
                  flat
                  :label="$t('common.ok_button')"
                  color="primary"
                  v-close-popup
                  @click="downloadICalFeed"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-btn-dropdown
            v-if="!this.$q.platform.is.mobile"
            flat
            :label="$t('lvplaner.calendar_subscribed_lvs')"
          >
            <q-list separator>
              <q-item v-for="(course, i) in this.lvStore.calendar" :key="i">
                <q-item-section avatar>
                  <q-fab
                    :style="{
                      backgroundColor: course.color || 'lightblue',
                      border: '2px solid lightgray',
                      position: 'fixed',
                    }"
                    padding="none"
                    icon="none"
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
                        '#5d5c61',
                      ]"
                      class="my-picker"
                      @change="changeColor(course, $event)"
                    />
                  </q-fab>
                </q-item-section>
                <q-item-section>
                  <div class="col-12 row">
                    <div class="col-12 row items-center">
                      {{ course.name }}
                      <span class="text-weight-bold q-ml-xs"
                        >({{ course.course_code }})</span
                      >
                    </div>
                  </div>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    icon="delete"
                    flat
                    color="negative"
                    @click.stop="removeCourse(course)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn-dropdown
            v-if="!this.$q.platform.is.mobile"
            flat
            :label="displayView()"
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="updateSelected('day', 'week')"
              >
                <q-item-section>
                  <q-item-label>
                    {{ $t("lvplaner.calendar_week") }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                @click="updateSelected('month', 'day')"
              >
                <q-item-section>
                  <q-item-label>{{
                    $t("lvplaner.calendar_month")
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <!-- MOBILE VIEW -->

          <q-btn v-if="this.$q.platform.is.mobile" flat icon="menu">
            <q-menu>
              <q-list>
                <q-item>
                  <q-btn
                    :label="$t('lvplaner.calendar_download_button')"
                    color="primary"
                    @click="(openDownloadDialog = true), selectAllCourses()"
                  />
                  <q-dialog v-model="openDownloadDialog">
                    <q-card>
                      <q-card-section>
                        <div class="text-h6">{{ $t("lvplaner.calendar_download_select_lv")}}</div>
                      </q-card-section>

                      <q-card-section class="q-pt-none">
                        <div
                          v-for="(course, i) in this.lvStore.calendar"
                          :key="i"
                        >
                          <q-checkbox
                            :label="course.name"
                            v-model="checkbox"
                            :val="course.name"
                          />
                        </div>
                      </q-card-section>

                      <q-card-actions align="right">
                        <q-btn
                          flat
                          :label="$t('common.cancel_button')"
                          color="red-4"
                          v-close-popup
                        />
                        <q-btn
                          flat
                          :label="$t('common.ok_button')"
                          color="primary"
                          v-close-popup
                          @click="downloadICalFeed"
                        />
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                </q-item>
                <q-item>
                  <q-btn-dropdown
                    flat
                    :label="$t('lvplaner.calendar_subscribed_lvs')"
                  >
                    <q-list separator>
                      <q-item
                        v-for="(course, i) in this.lvStore.calendar"
                        :key="i"
                      >
                        <q-item-section avatar>
                          <q-fab
                            :style="{
                              backgroundColor: course.color || 'lightblue',
                              border: '2px solid lightgray',
                              position: 'fixed',
                            }"
                            padding="none"
                            icon="none"
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
                                '#5d5c61',
                              ]"
                              class="my-picker"
                              @change="changeColor(course, $event)"
                            />
                          </q-fab>
                        </q-item-section>
                        <q-item-section>
                          <div class="col-12 row">
                            <div class="col-12 row items-center">
                              {{ course.name }}
                              <span class="text-weight-bold q-ml-xs"
                                >({{ course.course_code }})</span
                              >
                            </div>
                          </div>
                        </q-item-section>
                        <q-item-section side>
                          <q-btn
                            icon="delete"
                            flat
                            color="negative"
                            @click.stop="removeCourse(course)"
                          />
                        </q-item-section>
                      </q-item>
                      <q-item> </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </q-item>
                <q-item>
                  <q-btn-dropdown flat :label="displayView()">
                    <q-list>
                      <q-item
                        clickable
                        v-close-popup
                        @click="updateSelected('day', 'week')"
                      >
                        <q-item-section>
                          <q-item-label>
                            {{ $t("lvplaner.calendar_week") }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item
                        clickable
                        v-close-popup
                        @click="updateSelected('month', 'day')"
                      >
                        <q-item-section>
                          <q-item-label>{{
                            $t("lvplaner.calendar_month")
                          }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
        <q-separator inset />
        <div
          class="col-12 text-h6 bg-white text-weight-bold q-pa-md row justify-between"
        >
          <q-btn flat icon="navigate_before" color="blue-7" @click="onPrev" />
          {{ formattedMonth }}
          <q-btn flat icon="navigate_next" color="blue-7" @click="onNext" />
        </div>
        <q-calendar
          ref="calendar"
          v-model="selectedDate"
          :mode="selectedCalendar"
          :view="selectedView"
          bordered
          animated
          locale="De-de"
          day-min-height="120"
          hoverable
          focusable
          :weekdays="[1, 2, 3, 4, 5, 6, 0]"
          style="width: 100%"
        >
          <template
            #day="{ scope: { timestamp } }"
            v-if="selectedCalendar == 'month' && selectedView == 'day'"
          >
            <template
              v-for="event in eventsMap[timestamp.date]"
              :key="event.id"
            >
              <q-badge
                align="middle"
                multi-line
                :style="{ backgroundColor: event.color }"
              >
                <div class="col-12 row">
                  {{ event.name }}
                </div>
                <q-tooltip>
                  <div>
                    <span style="text-decoration: underline">Ort:</span>
                    {{ event.location }}
                  </div>
                  <div>
                    <span style="text-decoration: underline">Uhrzeit:</span>
                    {{ event.startTime }} - {{ event.endTime }}
                  </div>
                </q-tooltip>
              </q-badge>
            </template>
          </template>

          <template
            #day-body="{
              scope: { timestamp, timeStartPos, timeDurationHeight },
            }"
            v-if="selectedCalendar === 'day' && selectedView === 'week'"
          >
            <template
              v-for="event in getEvents(timestamp.date)"
              :key="event._id"
            >
              <q-badge
                align="middle"
                multi-line
                class="my-event justify-center"
                :style="
                  badgeStyles(event, 'day', timeStartPos, timeDurationHeight)
                "
                :class="badgeClasses(event, 'body')"
              >
                <div class="row col-12 text-caption">
                  {{ event.name }}
                </div>
                <q-tooltip>
                  <div>
                    <span style="text-decoration: underline">Name:</span>
                    {{ event.name }},
                  </div>
                  <div>
                    <span style="text-decoration: underline">Ort:</span>
                    {{ event.location }},
                  </div>
                  <div>
                    <span style="text-decoration: underline"
                      >Professor/in:</span
                    >
                    <div v-for="prof in event.taught_by" :key="prof">
                      {{ prof }}
                    </div>
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
import {
  QCalendar,
  parsed,
  addToDate,
  isBetweenDates,
  //parseTimestamp,
  today,
} from "@quasar/quasar-ui-qcalendar/src/index.js";
import "@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass";

import { defineComponent, ref, computed } from "vue";
import { useQuasar } from "quasar";

// The function below is used to set up our demo data

export default defineComponent({
  name: "DayCustomHeader",
  components: {
    QCalendar,
  },
  setup() {
    const selectedDate = ref(today()),
      calendar = ref(null),
      selectedCalendar = ref("month"),
      selectedView = ref("day"),
      locale = ref("de-DE"),
      transitionPrev = ref("slide-left"),
      transitionNext = ref("slide-right"),
      transition = ref("");
    //const lvStore = useLvStore();
    const q = useQuasar();

    const formattedMonth = computed(() => {
      const date = new Date(selectedDate.value);
      return monthFormatter().format(date) + " " + date.getFullYear();
    });

    function monthFormatter() {
      try {
        return new Intl.DateTimeFormat(locale.value || undefined, {
          month: "long",
          timeZone: "UTC",
        });
      } catch (e) {
        //
      }
    }
    const updateSelected = (calendar, view) => {
      selectedCalendar.value = calendar;
      selectedView.value = view;
    };

    function onPrev() {
      calendar.value.prev();
    }

    function onNext() {
      calendar.value.next();
    }
    function onToday() {
      calendar.value.moveToToday();
    }

    return {
      selectedDate,
      calendar,
      selectedCalendar,
      selectedView,
      locale,
      transitionPrev,
      transitionNext,
      transition,
      formattedMonth,
      updateSelected,
      parsed,
      addToDate,
      isBetweenDates,
      onPrev,
      onNext,
      onToday,
      openDownloadDialog: ref(false),
      checkbox: ref([]),
      q,
    };
  },
  computed: {
    setDirection() {
      return this.$q.platform.is.desktop ? "left" : "right";
    },

    /* for month view */
    eventsMap() {
      let map = {};
      let events = this.lvStore.calendar;

      if (events.length > 0) {
        events.forEach((event) => {
          event.dates.forEach((date) => {
            let dateTransformed = date.start.substring(
              0,
              date.start.indexOf("T")
            );

            if (!map[dateTransformed]) {
              map[dateTransformed] = [];
            }

            let modifiedDate = { ...date };
            let startIndex = date.start.indexOf("T") + 1;
            let endIndex = date.start.indexOf(":", startIndex);
            let startTime = date.start.substring(startIndex, endIndex + 3);

            let startIndex2 = date.end.indexOf("T") + 1;
            let endIndex2 = date.end.indexOf(":", startIndex2);
            let endTime2 = date.end.substring(startIndex2, endIndex2 + 3);

            modifiedDate.name = event.name;
            modifiedDate.startTime = startTime;
            modifiedDate.endTime = endTime2;
            modifiedDate.date = dateTransformed;
            modifiedDate.taught_by = event.taught_by;
            modifiedDate.color = event.color;
            map[dateTransformed].push(modifiedDate);
          });
        });
      }
      return map;
    }, 
  },
  methods: {
    selectAllCourses() {
      this.checkbox = this.lvStore.calendar.map((course) => course.name);
    },
    /**DOWNLOAD CALENDAR */
    downloadICalFeed() {
      // Konvertiere die Kursdaten in das iCalendar-Format
      const iCalData = this.convertToICalFormat(this.lvStore.calendar);

      // Erstelle eine Blob mit dem iCalendar-Daten
      const blob = new Blob([iCalData], { type: "text/calendar" });

      // Erstelle einen Download-Link für die .ics-Datei
      const url = window.URL.createObjectURL(blob);

      // Erstelle einen versteckten <a> -Link und klicke darauf, um den Download zu starten
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "mein_kalender.ics";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },

    convertToICalFormat(calendarData) {
      let iCalString = "BEGIN:VCALENDAR\n";
      iCalString += "VERSION:2.0\n";
      iCalString += "METHOD:PUBLISH\n";

      // Füge den VTIMEZONE-Block hinzu (statisch)
      iCalString += "BEGIN:VTIMEZONE\n";
      iCalString += "TZID:Europe/Vienna\n";
      iCalString += "X-LIC-LOCATION:Europe/Vienna\n";
      iCalString += "DTSTART:19001028T030000\n";
      iCalString += "TZOFFSETFROM:+0200\n";
      iCalString += "TZOFFSETTO:+0100\n";
      iCalString += "DTSTART:19000325T020000\n";
      iCalString += "TZOFFSETFROM:+0100\n";
      iCalString += "TZOFFSETTO:+0200\n";
      iCalString += "END:VTIMEZONE\n";

      // Iteriere durch jeden Kurs
      calendarData.forEach((course) => {
        // Überprüfe, ob der Kursname in der checkbox-Liste enthalten ist
        if (this.checkbox.includes(course.name)) {
          // Füge den Kalendernamen für diesen Kurs hinzu
          iCalString += `X-WR-CALNAME:${course.name}\n`;

          // Iteriere durch die Termine des Kurses
          course.dates.forEach((date) => {
            // Extrahiere die Informationen aus dem Datum
            const startDate = new Date(date.start);
            const endDate = new Date(date.end);

            // Formatiere die Daten im iCalendar-Datumzeitformat (YYYYMMDDTHHMMSSZ)
            const startDateFormat = this.formatICalDate(startDate);
            const endDateFormat = this.formatICalDate(endDate);

            // Füge einen iCalendar-Eintrag für diesen Kurs und diesen Termin hinzu
            iCalString += "BEGIN:VEVENT\n";
            iCalString += `SUMMARY:${course.name}\n`;
            iCalString += `DTSTART;TZID=Europe/Vienna:${startDateFormat}\n`;
            iCalString += `DTEND;TZID=Europe/Vienna:${endDateFormat}\n`;
            iCalString += `DTSTAMP;VALUE=DATE-TIME:${this.formatICalDate(
              new Date()
            )}\n`;
            iCalString += `UID:${this.generateUID()}\n`;
            iCalString += `LOCATION:${date.location}\n`;
            iCalString += "END:VEVENT\n";
          });
        }
      });

      iCalString += "END:VCALENDAR";
      return iCalString;
    },
    formatICalDate(date) {
      // Formatiere das Datum im iCalendar-Datumzeitformat (YYYYMMDDTHHMMSSZ)
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    },
    generateUID() {
      // Erstelle eine zufällige UUID
      const uuid = () => {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function (c) {
            const r = (Math.random() * 16) | 0,
              v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          }
        );
      };
      return uuid();
    },
    /* removes Course from User's db  */
    async removeCourse(course) {
      await this.lvStore.removeCourse(course._id, this.q.notify);
      this.lvStore.fetchRegisteredCourses();
    },
    getEvents(dt) {
      /* for week view */
      /* nimmt data aus eventsMap() */
      let events = this.eventsMap[dt] || [];
      events.forEach((event) => {
        /* modifyed startTime und endTime um duration zu bilden, damit die uhrzeit richtig gerendert werden kann */
        if (event.startTime && event.endTime) {
          let startTime =
            parseInt(event.startTime.split(":")[0]) * 60 +
            parseInt(event.startTime.split(":")[1]);
          let endTime =
            parseInt(event.endTime.split(":")[0]) * 60 +
            parseInt(event.endTime.split(":")[1]);
          let duration = endTime - startTime;

          event.duration = duration;
        }
      });
      /* Checks if times of courses overlap
      --> if yes add event.side to "left/right"
      --> (needed for badgeClasses) */
      for (let i = 0; i < events.length; ++i) {
        let overlapCount = 0;

        if (events[i].date === dt && events[i].startTime) {
          for (let j = 0; j < events.length; ++j) {
            if (i !== j && events[j].date === dt && events[j].startTime) {
              if (this.checkOverlap(events[i], events[j])) {
                events[j].side = "left";
                events[i].side = "right";
                overlapCount++;
              }
            }
          }

          if (overlapCount === 0) {
            events[i].side = undefined;
          }
        }
      }
      if (events.length > 2) {
        for (let i = 0; i < events.length; ++i) {
          if (
            events[i].date === dt &&
            events[i].startTime &&
            events[i].side !== "third"
          ) {
            for (let i = 0; i < events.length; ++i) {
              if (
                events[i].date === dt &&
                events[i].startTime &&
                events[i].side !== "third"
              ) {
                for (let j = 0; j < events.length; ++j) {
                  if (i !== j && events[j].date === dt && events[j].startTime) {
                    for (let k = 0; k < events.length; ++k) {
                      if (
                        k !== i &&
                        k !== j &&
                        events[k].date === dt &&
                        events[k].startTime
                      ) {
                        for (let l = 0; l < events.length; ++l) {
                          if (
                            l !== i &&
                            l !== j &&
                            l !== k &&
                            events[l].date === dt &&
                            events[l].startTime
                          ) {
                            const overlap4 = this.checkOverlap4(
                              events[i],
                              events[j],
                              events[k],
                              events[l]
                            );

                            if (overlap4) {
                              events[j].side = "fourth-one";
                              events[i].side = "fourth-two";
                              events[k].side = "fourth-three";
                              events[l].side = "fourth-four";
                              break;
                            }
                          }
                        }
                        if (
                          events[j].side !== "fourth-one" &&
                          events[i].side !== "fourth-two" &&
                          events[k].side !== "fourth-three"
                        ) {
                          const overlap3 = this.checkOverlap3(
                            events[i],
                            events[j],
                            events[k]
                          );
                          if (overlap3) {
                            events[j].side = "third-one";
                            events[i].side = "third-two";
                            events[k].side = "third-three";
                            break;
                          }
                        }
                        if (events[i].side !== undefined) {
                          break;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      return events;
    },
    /* function needed for getEvents
    --> checks Overlap of event times */
    checkOverlap(event1, event2) {
      const startTime1 = new Date(event1.start).getTime();
      const endTime1 = new Date(event1.end).getTime();
      const startTime2 = new Date(event2.start).getTime();
      const endTime2 = new Date(event2.end).getTime();
      return startTime1 < endTime2 && startTime2 < endTime1;
    },
    checkOverlap3(event1, event2, event3) {
      const startTime1 = new Date(event1.start).getTime();
      const endTime1 = new Date(event1.end).getTime();
      const startTime2 = new Date(event2.start).getTime();
      const endTime2 = new Date(event2.end).getTime();
      const startTime3 = new Date(event3.start).getTime();
      const endTime3 = new Date(event3.end).getTime();

      return (
        startTime1 < endTime2 &&
        startTime2 < endTime1 &&
        startTime1 < endTime3 &&
        startTime3 < endTime1 &&
        startTime2 < endTime3 &&
        startTime3 < endTime2
      );
    },
    checkOverlap4(event1, event2, event3, event4) {
      const startTime1 = new Date(event1.start).getTime();
      const endTime1 = new Date(event1.end).getTime();
      const startTime2 = new Date(event2.start).getTime();
      const endTime2 = new Date(event2.end).getTime();
      const startTime3 = new Date(event3.start).getTime();
      const endTime3 = new Date(event3.end).getTime();
      const startTime4 = new Date(event4.start).getTime();
      const endTime4 = new Date(event4.end).getTime();

      return (
        startTime1 < endTime2 &&
        startTime2 < endTime1 &&
        startTime1 < endTime3 &&
        startTime3 < endTime1 &&
        startTime1 < endTime4 &&
        startTime4 < endTime1 &&
        startTime2 < endTime3 &&
        startTime3 < endTime2 &&
        startTime2 < endTime4 &&
        startTime4 < endTime2 &&
        startTime3 < endTime4 &&
        startTime4 < endTime3
      );
    },
    /* TODO noch anpassen und hinzufügen */
    badgeClasses(event) {
      return {
        [`text-white`]: true,
        "full-width": !event.side || event.side === "full",
        "left-side": event.side === "left",
        "right-side": event.side === "right",
        "third-one": event.side === "third-one",
        "third-two": event.side === "third-two",
        "third-three": event.side === "third-three",
        "fourth-one": event.side === "fourth-one",
        "fourth-two": event.side === "fourth-two",
        "fourth-three": event.side === "fourth-three",
        "fourth-four": event.side === "fourth-four",
        "rounded-border": true,
      };
    },
    /* Style, damit dates in richtiger Uhrezeit angezeigt werden in week view */
    badgeStyles(
      event,
      type,
      timeStartPos = undefined,
      timeDurationHeight = undefined
    ) {
      const s = {};
      if (timeStartPos && timeDurationHeight) {
        s.top = timeStartPos(event.startTime) + "px";
        s.height = timeDurationHeight(event.duration) + "px";
        s.backgroundColor = event.color || "lightblue";
      }
      return s;
    },
    displayView() {
      if (this.selectedCalendar === "day" && this.selectedView === "day") {
        return "Tag";
      } else if (
        this.selectedCalendar === "day" &&
        this.selectedView === "week"
      ) {
        return "Woche";
      } else if (
        this.selectedCalendar === "month" &&
        this.selectedView === "day"
      ) {
        return "Monat";
      }
    },
    async changeColor(course, changedColor) {
      await this.lvStore.changeColor(course._id, changedColor);
      this.lvStore.fetchRegisteredCourses();
    },
  },
  async mounted() {
    // this.$i18n.locale = 'en' // manually set the locale
    try {
      await this.lvStore.fetchRegisteredCourses();
      this.$emit("loaded");
    } catch (error) {
      console.log(error);
    }
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

button {
  font-family: "Poppins", sans-serif;
}
.my-event {
  width: 100%;
  position: absolute;
  border: solid lightgray 1px;
}
.my-picker {
  width: 250px;
  transition: all 0.2s ease-in-out;
  z-index: 1;
}
.my-picker:hover {
  transform: scale(1.1);
}
.q-badge--multi-line {
  word-break: normal;
  overflow: hidden;
}
.full-width {
  left: 0;
  width: 100%;
}
.left-side {
  left: 0;
  width: 49.75%;
}
.right-side {
  left: 50.25%;
  width: 49.75%;
}
.third-one {
  left: 0;
  width: calc(33.333% - 0.5%);
}
.third-two {
  left: calc(33.333% + 0.5%);
  width: calc(33.333% - 1%);
}
.third-three {
  left: calc(66.666% + 0.5%);
  width: calc(33.333% - 0.5%);
}
.fourth-one {
  left: 0;
  width: calc(25% - 0.5%);
}

.fourth-two {
  left: calc(25% + 0.5%);
  width: calc(25% - 1%);
}

.fourth-three {
  left: calc(50% + 0.5%);
  width: calc(25% - 1%);
}

.fourth-four {
  left: calc(75% + 0.5%);
  width: calc(25% - 0.5%);
}
</style>
