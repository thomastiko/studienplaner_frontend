<template>
  <div>
    <!-- Desktop/Laptop Ansicht -->
    <div class="row" v-if="$q.screen.gt.sm">
      <div class="col-12 col-md-6" :class="{ 'scrollable-container': $q.screen.gt.sm }">
        <div v-if="!loading">
          <div class="row q-ma-md">
            <div class="text-h5 text-weight-medium q-mb-sm col-12">
              {{ $t('lvPlaner.add_lvs') }}
            </div>
            <div class="col-12">
              <q-select
                filled
                v-model="selectedSubject"
                use-input
                clearable
                :options="filteredOptions"
                @filter="filterFn"
                :label="$t('lvPlaner.search_lvs')"
                @update:model-value="onSubjectChange"
              >
              </q-select>
            </div>

            <!-- Zeige die gefilterten Kurse an -->
            <div v-if="filteredCourses.length" class="col-12 row q-col-gutter-sm">
              <div
                v-for="course in filteredCourses"
                :key="course._id.$oid"
                class="col-xs-12 col-md-6 col-lg-4 q-mt-md"
                style="max-width: 400px"
              >
                <q-expansion-item
                  :style="{ backgroundColor: isCourseInUserCourses(course) ? 'lightgreen' : '' }"
                  style="max-width: 500px"
                  class="shadow-1"
                  default-opened
                  header-class="text-grey-8"
                >
                  <template v-slot:header>
                    <q-item-section avatar>
                      <!-- Button ändern je nachdem, ob der Kurs bereits hinzugefügt wurde -->
                      <q-btn
                        v-if="!isCourseInUserCourses(course)"
                        icon="add"
                        padding="xs"
                        round
                        size="sm"
                        color="blue-7"
                        text-color="white"
                        @click.stop="addCourseToUser(course)"
                      ></q-btn>
                      <q-btn
                        v-else
                        icon="remove"
                        padding="xs"
                        round
                        size="sm"
                        color="red-7"
                        text-color="white"
                        @click.stop="removeCourseFromUser(course)"
                      ></q-btn>
                    </q-item-section>
                    <q-item-section>
                      <div class="col-12 row">
                        <div class="col-12 row items-center">
                          {{ course.name }}
                          <span class="text-weight-bold q-ml-xs">({{ course.course_code }})</span>
                        </div>
                      </div>
                    </q-item-section>
                  </template>
                  <q-separator />
                  <!-- Restlicher Inhalt des q-expansion-item -->
                  <div class="row q-pa-sm">
                    <div class="col-12 row items-center text-blue-7 text-body2">
                      <div>Prof:</div>
                      <q-btn
                        no-caps
                        flat
                        dense
                        color="grey-8"
                        v-for="prof in course.taught_bys"
                        :key="prof"
                        @click="previewProf(prof)"
                        class="text-bold"
                      >
                        {{ prof.firstName }} {{ prof.lastName }},
                      </q-btn>
                    </div>
                    <q-separator />
                    <div class="col-12 text-blue-7 text-body2">
                      {{ $t('lvPlaner.mode') }}: <span class="text-grey-8">{{ course.mode }}</span>
                    </div>
                    <div class="col-12 text-blue-7 text-body2">
                      {{ $t('lvPlaner.language') }}:
                      <span class="text-grey-8">{{ course.language }}</span>
                    </div>
                    <div class="text-blue-7">
                      <a :href="course.vvz_url" target="_blank" class="text-blue-7 text-body2">{{
                        $t('lvPlaner.to_vvz')
                      }}</a>
                    </div>
                  </div>
                  <q-separator />
                  <div class="text-blue-7 text-body2 q-pl-sm q-pt-sm">
                    {{ $t('lvPlaner.dates') }}:
                  </div>
                  <q-list separator>
                    <q-item
                      v-for="(date, i) in course.dates"
                      :key="i"
                      :class="{
                        'bg-warning shadow-1 text-white cursor-pointer my-clickable':
                          findOverlapForDate(date) &&
                          !isCourseInUserCourses(course) &&
                          findOverlapForDate(date)?.subjectName !== selectedSubject &&
                          findOverlapForDate(date)?.courseName !== course.name
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
                          <span class="text-body2 text-blue-7">{{ date.location }}</span>
                        </template>
                      </div>
                      <q-popup-proxy
                        v-if="
                          findOverlapForDate(date) &&
                          !isCourseInUserCourses(course) &&
                          findOverlapForDate(date)?.subjectName !== selectedSubject &&
                          findOverlapForDate(date)?.courseName !== course.name
                        "
                      >
                        <q-banner>
                          <template v-slot:avatar>
                            <q-icon name="warning" color="warning" />
                          </template>
                          <div>
                            {{ $t('lvPlaner.overlap_with_course') }}:
                            <strong
                              >{{ findOverlapForDate(date)?.courseName }} ({{
                                findOverlapForDate(date)?.courseCode
                              }})
                            </strong>
                          </div>
                          <div>
                            {{ $t('lvPlaner.date') }}:
                            <strong>
                              {{
                                formatTimeRange(
                                  findOverlapForDate(date)?.specificDate.start,
                                  findOverlapForDate(date)?.specificDate.end
                                )
                              }}</strong
                            >
                          </div>
                        </q-banner>
                      </q-popup-proxy>
                    </q-item>
                  </q-list>
                </q-expansion-item>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="row justify-center q-ma-xl">
          <q-spinner size="50px" color="blue" />
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="row q-ma-md">
          <div class="col-12">
            <Calendar />
          </div>
        </div>
      </div>
      <q-dialog v-if="showProfPreview" v-model="showProfPreview">
        <q-card style="width: 700px; max-width: 100vw">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">{{ $t('lvPlaner.prof_preview') }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section class="column justify-center q-pb-none">
            <div class="col-12 row justify-center">
              <div class="text-h6 text-bold q-mr-sm">
                {{ profStore.profPreview.fname }} {{ profStore.profPreview.lname }}
              </div>
              <q-rating
                v-model="profStore.profPreview.factors[0].gesamt"
                size="1.5em"
                icon="star_border"
                icon-selected="star"
                icon-half="star_half"
                color-half="amber-6"
                color-selected="amber-6"
                color="amber-8"
                readonly
              />
            </div>
            <div class="col-12 text-center text-body2">
              {{ $t('profcheck.based_on') }}
              <strong>{{ profStore.profPreview.factors[0].ratings }} </strong>
              {{ $t('profcheck.ratings') }}
            </div>
            <q-btn
              :label="$t('lvPlaner.prof_more_details')"
              flat
              style="color: #00b9f7"
              @click="goToProf"
            />
          </q-card-section>
          <q-card-section>
            <div class="text-h6 text-center">{{ $t('lvPlaner.prof_rating') }}:</div>
            <div
              class="row justify-center"
              v-if="
                profStore.profPreview.factors[0].ratings > 0 &&
                profStore.profPreview.factors[0].lerninhahlte !== null &&
                profStore.profPreview.factors[0].atmospahre !== null &&
                profStore.profPreview.factors[0].mitarbeit !== null &&
                profStore.profPreview.factors[0].benotung !== null &&
                profStore.profPreview.factors[0].verfugbarkeit !== null &&
                profStore.profPreview.factors[0].empfhelung !== null &&
                profStore.profPreview.factors[0].gesamt !== null
              "
            >
              <div class="col-12 col-md-8 row justify-center">
                <div class="col-6 col-md-4 row justify-center">
                  <q-card class="text-center q-pa-xs" style="max-width: 120px">
                    <div class="text-h6 text-bold">
                      {{ profStore.profPreview.factors[0].lerninhahlte }}
                    </div>
                    <div class="text-subtitle2">{{ $t('lvPlaner.prof_learning_content') }}</div>
                  </q-card>
                </div>
                <div class="col-6 col-md-4 row justify-center">
                  <q-card class="text-center q-pa-xs" style="max-width: 120px">
                    <div class="text-h6 text-bold">
                      {{ profStore.profPreview.factors[0].atmospahre }}
                    </div>
                    <div class="text-subtitle2">{{ $t('lvPlaner.prof_atmosphere') }}</div>
                  </q-card>
                </div>
                <div class="col-6 col-md-4 row justify-center">
                  <q-card class="text-center q-pa-xs" style="max-width: 120px">
                    <div class="text-h6 text-bold">
                      {{ profStore.profPreview.factors[0].mitarbeit }}
                    </div>
                    <div class="text-subtitle2">{{ $t('lvPlaner.prof_participation') }}</div>
                  </q-card>
                </div>
                <div class="col-6 col-md-4 row justify-center">
                  <q-card class="text-center q-pa-xs" style="max-width: 120px">
                    <div class="text-h6 text-bold">
                      {{ profStore.profPreview.factors[0].benotung }}
                    </div>
                    <div class="text-subtitle2">{{ $t('lvPlaner.prof_grading') }}</div>
                  </q-card>
                </div>
                <div class="col-6 col-md-4 row justify-center">
                  <q-card class="text-center q-pa-xs" style="max-width: 120px">
                    <div class="text-h6 text-bold">
                      {{ profStore.profPreview.factors[0].verfugbarkeit }}
                    </div>
                    <div class="text-subtitle2">{{ $t('lvPlaner.prof_availability') }}</div>
                  </q-card>
                </div>
                <div class="col-6 col-md-4 row justify-center">
                  <q-card class="text-center q-pa-xs" style="max-width: 120px">
                    <div class="text-h6 text-bold">
                      {{ profStore.profPreview.factors[0].empfhelung }}
                    </div>
                    <div class="text-subtitle2">{{ $t('lvPlaner.prof_recommendation') }}</div>
                  </q-card>
                </div>
              </div>
            </div>
            <div class="row justify-center" v-else>
              <div>{{ $t('lvPlaner.prof_no_ratings') }}:</div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-if="profNotFound" v-model="profNotFound">
        <q-card style="width: 400px; max-width: 80vw">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">{{ $t('lvPlaner.prof_not_in_db_title') }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section>
            <div class="text-body1">
              {{ $t('lvPlaner.prof_not_in_db') }}
            </div>
            <div>
              <a href="mailto:beratung@oeh-wu.at" class="text-primary">beratung@oeh-wu.at</a>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Ok" color="primary" @click="profNotFound = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <!-- Mobile Ansicht -->
    <div v-if="$q.screen.lt.md">
      <div class="col-12 col-md-6" :class="{ 'scrollable-container': $q.screen.gt.sm }">
        <div v-if="!loading">
          <div class="row q-ma-md">
            <div class="text-h5 text-weight-medium q-mb-sm col-12">
              {{ $t('lvPlaner.add_lvs') }}
            </div>
            <div class="col-12">
              <q-select
                filled
                v-model="selectedSubject"
                use-input
                clearable
                :options="filteredOptions"
                @filter="filterFn"
                :label="$t('lvPlaner.search_lvs')"
                @update:model-value="onSubjectChange"
              >
              </q-select>
            </div>

            <!-- Zeige die gefilterten Kurse an -->
            <div v-if="filteredCourses.length" class="col-12 row q-col-gutter-sm">
              <div
                v-for="course in filteredCourses"
                :key="course._id.$oid"
                class="col-xs-12 col-md-6 col-lg-4 q-mt-md"
                style="max-width: 400px"
              >
                <q-expansion-item
                  :style="{
                    backgroundColor: isCourseInUserCourses(course) ? 'lightgreen' : ''
                  }"
                  style="max-width: 500px"
                  class="shadow-1"
                  default-opened
                  header-class="text-grey-8"
                >
                  <template v-slot:header>
                    <q-item-section avatar>
                      <!-- Button ändern je nachdem, ob der Kurs bereits hinzugefügt wurde -->
                      <q-btn
                        v-if="!isCourseInUserCourses(course)"
                        icon="add"
                        padding="xs"
                        round
                        size="sm"
                        color="blue-7"
                        text-color="white"
                        @click.stop="addCourseToUser(course)"
                      ></q-btn>
                      <q-btn
                        v-else
                        icon="remove"
                        padding="xs"
                        round
                        size="sm"
                        color="red-7"
                        text-color="white"
                        @click.stop="removeCourseFromUser(course)"
                      ></q-btn>
                    </q-item-section>
                    <q-item-section>
                      <div class="col-12 row">
                        <div class="col-12 row items-center">
                          {{ course.name }}
                          <span class="text-weight-bold q-ml-xs">({{ course.course_code }})</span>
                        </div>
                      </div>
                    </q-item-section>
                  </template>
                  <q-separator />
                  <!-- Restlicher Inhalt des q-expansion-item -->
                  <div class="row q-pa-sm">
                    <div class="col-12 row items-center text-blue-7 text-body2">
                      <div>Prof:</div>
                      <q-btn
                        no-caps
                        flat
                        dense
                        color="grey-8"
                        v-for="prof in course.taught_bys"
                        :key="prof"
                        @click="previewProf(prof)"
                        class="text-bold"
                      >
                        {{ prof.firstName }} {{ prof.lastName }},
                      </q-btn>
                    </div>
                    <q-separator />
                    <div class="col-12 text-blue-7 text-body2">
                      {{ $t('lvPlaner.mode') }}:
                      <span class="text-grey-8">{{ course.mode }}</span>
                    </div>
                    <div class="col-12 text-blue-7 text-body2">
                      {{ $t('lvPlaner.language') }}:
                      <span class="text-grey-8">{{ course.language }}</span>
                    </div>
                    <div class="text-blue-7">
                      <a :href="course.vvz_url" target="_blank" class="text-blue-7 text-body2">{{
                        $t('lvPlaner.to_vvz')
                      }}</a>
                    </div>
                  </div>
                  <q-separator />
                  <div class="text-blue-7 text-body2 q-pl-sm q-pt-sm">
                    {{ $t('lvPlaner.dates') }}:
                  </div>
                  <q-list separator>
                    <q-item
                      v-for="(date, i) in course.dates"
                      :key="i"
                      :class="{
                        'bg-warning shadow-1 text-white cursor-pointer my-clickable':
                          findOverlapForDate(date) &&
                          !isCourseInUserCourses(course) &&
                          findOverlapForDate(date)?.subjectName !== selectedSubject &&
                          findOverlapForDate(date)?.courseName !== course.name
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
                          <span class="text-body2 text-blue-7">{{ date.location }}</span>
                        </template>
                      </div>
                      <q-popup-proxy
                        v-if="
                          findOverlapForDate(date) &&
                          !isCourseInUserCourses(course) &&
                          findOverlapForDate(date)?.subjectName !== selectedSubject &&
                          findOverlapForDate(date)?.courseName !== course.name
                        "
                      >
                        <q-banner>
                          <template v-slot:avatar>
                            <q-icon name="warning" color="warning" />
                          </template>
                          <div>
                            {{ $t('lvPlaner.overlap_with_course') }}:
                            <strong
                              >{{ findOverlapForDate(date)?.courseName }} ({{
                                findOverlapForDate(date)?.courseCode
                              }})
                            </strong>
                          </div>
                          <div>
                            {{ $t('lvPlaner.date') }}:
                            <strong>
                              {{
                                formatTimeRange(
                                  findOverlapForDate(date)?.specificDate.start,
                                  findOverlapForDate(date)?.specificDate.end
                                )
                              }}</strong
                            >
                          </div>
                        </q-banner>
                      </q-popup-proxy>
                    </q-item>
                  </q-list>
                </q-expansion-item>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="row justify-center q-ma-xl">
          <q-spinner size="50px" color="blue" />
        </div>
        <div>
          <q-btn
            color="blue-4"
            icon-right="calendar_month"
            :label="$t('lvPlaner.my_calendar')"
            no-caps
            size="md"
            class="fab-position"
            @click="showCalendar = true"
          ></q-btn>
        </div>
      </div>
      <q-dialog v-model="showCalendar" maximized persistent>
        <div class="q-ma-none q-pa-none">
          <div class="row items-center q-pa-sm bg-white">
            <q-space />
            <q-btn class="q-pa-sm" icon="close" flat round dense v-close-popup />
          </div>
          <div>
            <Calendar />
          </div>
        </div>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { useLvStore } from '@/stores/lv.store'
import { useUserStore } from '@/stores/user.store'
import { useProfStore } from '@/stores/prof.store'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Calendar from '../components/lvplaner/calendar.vue'
import router from '../router'

export default {
  components: {
    Calendar
  },
  setup() {
    const lvStore = useLvStore()
    const userStore = useUserStore()
    const profStore = useProfStore()
    const selectedSubject = ref(null)
    const filteredOptions = ref([])
    const loading = ref(true)
    const isDataLoaded = ref(false)
    const overlappingDates = ref([])
    const showCalendar = ref(false)

    const courses = computed(() => lvStore.list || [])
    const cartItems = computed(() => lvStore.cart)

    const uniqueSubjectNames = computed(() => {
      return [...new Set(courses.value.map((course) => course.subject_name))]
    })

    const filteredCourses = computed(() => {
      if (!selectedSubject.value && cartItems.value.length > 0) {
        const matchedCourses = courses.value.filter((course) =>
          cartItems.value.some((cartItem) => cartItem.name === course.subject_name)
        )

        return matchedCourses.sort((a, b) => {
          const indexA = cartItems.value.findIndex((cartItem) => cartItem.name === a.subject_name)
          const indexB = cartItems.value.findIndex((cartItem) => cartItem.name === b.subject_name)
          return indexA - indexB // Sortiere aufsteigend nach der Reihenfolge im Cart
        })
      }
      return courses.value.filter(
        (course) =>
          course.subject_name === selectedSubject.value ||
          (course.course_code === selectedSubject.value && course.subject_name)
      )
    })
    // Funktion die prüft, ob ein Datum überschneidet mit einem bereits bestehenden Kurs
    function getOverlappingCourse(date, existingCourses) {
      const dateStart = new Date(date.start?.$date || date.start)
      const dateEnd = new Date(date.end?.$date || date.end)

      for (const course of existingCourses) {
        for (const existingDate of course.dates) {
          const existingStart = new Date(existingDate.start?.$date || existingDate.start)
          const existingEnd = new Date(existingDate.end?.$date || existingDate.end)

          if (
            (dateStart >= existingStart && dateStart < existingEnd) || // Start überschneidet
            (dateEnd > existingStart && dateEnd <= existingEnd) || // Ende überschneidet
            (dateStart <= existingStart && dateEnd >= existingEnd) // Vollständige Überdeckung
          ) {
            const overlap = { course, existingStart, existingEnd }
            // Prüfen, ob die Überschneidung bereits vorhanden ist
            const alreadyExists = overlappingDates.value.some(
              (item) =>
                item.course === course &&
                item.existingStart.getTime() === existingStart.getTime() &&
                item.existingEnd.getTime() === existingEnd.getTime()
            )
            if (!alreadyExists) {
              overlappingDates.value.push(overlap)
            }

            return overlap
          }
        }
      }
      return null
    }
    const updateOverlappingDates = () => {
      overlappingDates.value = [] // Bestehende Überschneidungen zurücksetzen
      filteredCourses.value.forEach((course) => {
        course.dates.forEach((date) => {
          getOverlappingCourse(date, userStore.user.course_entries)
        })
      })
    }
    function findOverlapForDate(date) {
      const dateStart = new Date(date.start?.$date || date.start)
      const dateEnd = new Date(date.end?.$date || date.end)
      const overlap = overlappingDates.value.find((overlap) => {
        const existingStart = new Date(overlap.existingStart)
        const existingEnd = new Date(overlap.existingEnd)

        // Allgemeine Bedingung für Überschneidungen
        return dateStart < existingEnd && dateEnd > existingStart
      })

      if (overlap) {
        const specificDate = overlap.course.dates.find((d) => {
          const dStart = new Date(d.start?.$date || d.start)
          const dEnd = new Date(d.end?.$date || d.end)

          return dateStart <= dEnd && dateEnd >= dStart
        })

        if (specificDate) {
          return {
            courseName: overlap.course.name,
            courseCode: overlap.course.course_code,
            specificDate,
            subjectName: overlap.course.subject_name
          }
        }
      }

      return null
    }

    function formatTimeRange(dateStart, dateEnd) {
      const start = new Date(dateStart?.$date || dateStart)
      const end = new Date(dateEnd?.$date || dateEnd)

      // Überprüfe, ob die Werte gültig sind
      if (isNaN(start) || isNaN(end)) {
        return 'Invalid Time'
      }

      const options = { hour: '2-digit', minute: '2-digit' }

      const formattedStart = start.toLocaleTimeString(undefined, options)
      const formattedEnd = end.toLocaleTimeString(undefined, options)

      return `${formattedStart} - ${formattedEnd}`
    }

    // Funktion, um zu prüfen, ob der Kurs bereits hinzugefügt wurde
    const isCourseInUserCourses = (course) => {
      return userStore.user.course_entries.some(
        (c) => c.course_code === course.course_code && c.semester === course.semester
      )
    }

    const addCourseToUser = async (course) => {
      // Konvertiere die start und end Datumsfelder in ISO-Strings
      const convertedCourse = {
        ...course,
        dates: course.dates.map((date) => ({
          ...date,
          start: date.start?.$date
            ? new Date(date.start.$date).toISOString()
            : new Date(date.start).toISOString(),
          end: date.end?.$date
            ? new Date(date.end.$date).toISOString()
            : new Date(date.end).toISOString()
        }))
      }

      try {
        await userStore.addCourse(convertedCourse)
        userStore.fetchUser()
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Kurses:', error)
      }
    }

    const removeCourseFromUser = async (course) => {
      try {
        await userStore.deleteCourse(course.course_code, course.semester)
      } catch (error) {
        console.error('Fehler beim Entfernen des Kurses:', error)
      }
    }

    // Filterfunktion für das Dropdown
    const filterFn = (val, update) => {
      const needle = val.toLowerCase()
      update(() => {
        const subjectOptions = uniqueSubjectNames.value.filter((v) =>
          v.toLowerCase().includes(needle)
        )

        const codeOptions = courses.value
          .filter((course) => course.course_code.toLowerCase().includes(needle))
          .map((course) => course.subject_name)

        filteredOptions.value = [...new Set([...subjectOptions, ...codeOptions])].sort((a, b) =>
          a.localeCompare(b, 'de', { sensitivity: 'base' })
        )
      })
    }

    onMounted(async () => {
      try {
        await lvStore.fetchCourses()
        filteredOptions.value = uniqueSubjectNames.value
        isDataLoaded.value = true
        updateOverlappingDates()
      } catch (error) {
        console.error('Fehler beim Laden der LVs:', error)
      } finally {
        loading.value = false
      }
    })

    onBeforeUnmount(() => {
      selectedSubject.value = null
      lvStore.cart = []
    })

    return {
      lvStore,
      userStore,
      profStore,
      showProfPreview: ref(false),
      profNotFound: ref(false),
      selectedSubject,
      filteredOptions,
      filteredCourses,
      updateOverlappingDates,
      getOverlappingCourse,
      overlappingDates,
      findOverlapForDate,
      formatTimeRange,
      addCourseToUser,
      removeCourseFromUser,
      isCourseInUserCourses,
      filterFn,
      loading,
      isDataLoaded,
      showCalendar,
      slide: ref(1),
      formatDateRange(dateStart, dateEnd) {
        // Extrahiere die Datumsstrings aus den Objekten
        const start = new Date(dateStart.$date)
        const end = new Date(dateEnd.$date)

        // Überprüfe, ob das Format korrekt ist
        if (isNaN(start) || isNaN(end)) {
          return 'Invalid Date'
        }

        const options = {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }

        // Formatieren der Start- und Enddaten
        const formattedStart = start.toLocaleString(undefined, options)
        const formattedEnd = end.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' })

        return `${formattedStart} - ${formattedEnd}`
      }
    }
  },
  methods: {
    onSubjectChange(value) {
      this.selectedSubject = value // Aktualisiere das Fach
      this.overlappingDates.values = [] // Leere alte Überschneidungen

      // Berechne Überschneidungen
      this.filteredCourses.forEach((course) => {
        // Prüfe, ob der Kurs bereits in course_entries enthalten ist
        const isCourseInEntries = this.userStore.user.course_entries.some(
          (entry) => entry.course_code === course.course_code
        )

        if (!isCourseInEntries) {
          course.dates.forEach((date) => {
            this.getOverlappingCourse(date, this.userStore.user.course_entries)
          })
        }
      })
    },
    async previewProf(prof) {
      // Den vollständigen Namen in Vorname und Nachname aufteilen
      const { firstName, lastName } = prof

      try {
        // Objekt erstellen und in der Store-Funktion verwenden
        const obj = { fname: firstName, lname: lastName }
        await this.profStore.fetchProfPreview(obj)

        // Wenn der Professor gefunden wurde, zeige die Vorschau an
        this.showProfPreview = true
      } catch (error) {
        console.error('Fehler beim Laden der Professorenvorschau:', error)
        this.profNotFound = true

        // Fehlermeldung anzeigen, wenn der Professor nicht gefunden wurde
        this.$q.notify({
          type: 'negative',
          message: `Professor ${firstName} ${lastName} wurde nicht gefunden.`
        })
      }
    },
    async goToProf() {
      if (this.profStore.profPreview._id) {
        await this.profStore.findProf(this.profStore.profPreview._id)

        if (this.profStore.selectedProf) {
          // Navigiere zur Professorenseite
          router.push({
            name: 'ProfessorPage',
            params: { prof_id: this.profStore.selectedProf._id }
          })

          // Führe einen kleinen Timeout aus, um sicherzustellen, dass die Navigation abgeschlossen ist
          setTimeout(() => {
            // Seite nach der Navigation neu laden
            window.location.reload()
          }, 100) // Kleiner Timeout von 100ms, um die Navigation abzuwarten
        } else {
          console.error('Professor konnte nicht gefunden werden.')
        }
      } else {
        console.error('Keine Vorschau verfügbar.')
      }
    }
  },
  watch: {
    'userStore.user.course_entries': {
      handler() {
        if (this.isDataLoaded) {
          // Nur wenn die Daten geladen sind
          this.updateOverlappingDates()
        }
      },
      deep: true // Verschachtelte Änderungen erkennen
    }
  },
  beforeDestroy() {
    this.selectedSubject = null
    this.lvStore.cart = []
  }
}
</script>

<style scoped>
.q-card {
  width: 300px;
  margin: 10px;
}
.my-clickable {
  transition: all 0.3s;
}
.my-clickable:hover {
  filter: brightness(1.05);
}
.scrollable-container {
  max-height: 90vh;
  overflow-y: auto;
}
.fab-position {
  position: fixed;
  bottom: 16px;
  right: 20px;
}
</style>
