<template>
  <div>
    <div v-if="!loading">
      <div class="row q-ma-md">
        <div class="text-h3 text-weight-medium q-mb-sm col-12">{{ $t('lvPlaner.add_lvs') }}</div>
        <div class="col-12">
          <q-select
            filled
            v-model="selectedSubject"
            use-input
            clearable
            :options="filteredOptions"
            @filter="filterFn"
            :label="$t('lvPlaner.search_lvs')"
          >
          </q-select>
        </div>

        <!-- Zeige die gefilterten Kurse an -->
        <div v-if="filteredCourses.length" class="col-12 row">
          <div
            v-for="course in filteredCourses"
            :key="course._id.$oid"
            class="col-xs-12 col-md-6 col-lg-3 q-mt-md"
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
                <div class="text-blue-7">
                  <div>Prof:</div>
                  <q-btn
                    flat
                    color="grey-8"
                    v-for="prof in course.taught_bys"
                    :key="prof"
                    @click="previewProf(prof)"
                  >
                    {{ prof.firstName }} {{ prof.lastName }}
                  </q-btn>
                </div>
              </div>
              <q-separator />
              <div class="row justify-between q-pa-sm">
                <div class="text-blue-7">
                  {{ $t('lvPlaner.mode') }} <q-tooltip>{{ course.mode }}</q-tooltip>
                </div>
                <div class="text-blue-7">
                  <a :href="course.vvz_url" target="_blank" class="text-blue-7"> VVZ </a>
                </div>
                <div class="text-blue-7">
                  {{ $t('lvPlaner.language') }} <q-tooltip>{{ course.language }}</q-tooltip>
                </div>
              </div>
              <q-separator />
              <q-list padding separator>
                <q-item v-for="(date, i) in course.dates" :key="i">
                  {{ formatDateRange(date.start, date.end) }},&nbsp;
                  <span>
                    <a v-if="date.location !== 'null'" :href="date.location_url">
                      {{ date.location }}
                    </a>
                  </span>
                </q-item>
              </q-list>
            </q-expansion-item>
          </div>
        </div>
      </div>
      <div class="row q-ma-md">
        <div class="col-12 q-mt-xl">
          <Calendar />
        </div>
      </div>
    </div>
    <div v-else class="row justify-center q-ma-xl">
      <q-spinner size="50px" color="blue" />
    </div>
    <q-dialog v-if="showProfPreview" v-model="showProfPreview">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ $t('lvPlaner.prof_preview') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="column justify-center">
          <div class="text-h6 text-center">
            {{ profStore.profPreview.fname }} {{ profStore.profPreview.lname }}
          </div>
          <q-btn :label="$t('lvPlaner.prof_more_details')" flat color="primary" @click="goToProf" />
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-center">{{ $t('lvPlaner.prof_ratings') }}</div>
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
            <div class="col-3">
              {{ $t('lvPlaner.prof_rating') }}: {{ profStore.profPreview.factors[0].ratings }}
            </div>
            <div class="col-3">
              {{ $t('lvPlaner.prof_comments') }}: {{ profStore.profPreview.factors[0].comments }}
            </div>
            <div class="col-3">
              {{ $t('lvPlaner.prof_learning_content') }}:
              {{ profStore.profPreview.factors[0].lerninhahlte }}
            </div>
            <div class="col-3">
              {{ $t('lvPlaner.prof_atmosphere') }}:
              {{ profStore.profPreview.factors[0].atmospahre }}
            </div>
            <div class="col-3">
              {{ $t('lvPlaner.prof_participation') }}:
              {{ profStore.profPreview.factors[0].mitarbeit }}
            </div>
            <div class="col-3">
              {{ $t('lvPlaner.prof_grading') }}: {{ profStore.profPreview.factors[0].benotung }}
            </div>
            <div class="col-3">
              {{ $t('lvPlaner.prof_availability') }}:
              {{ profStore.profPreview.factors[0].verfugbarkeit }}
            </div>
            <div class="col-3">
              {{ $t('lvPlaner.prof_recommendation') }}:
              {{ profStore.profPreview.factors[0].empfhelung }}
            </div>
            <div class="col-3">
              {{ $t('lvPlaner.prof_overall') }}: {{ profStore.profPreview.factors[0].gesamt }}
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
          <div class="text-h6">Lehrkraft nicht vorhanden</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <div class="text-body1">
            Leider konnten wir die Lehrkraft nicht finden. Bitte schreibe uns eine E-Mail an
            <a href="mailto:beratung@oeh-wu.at" class="text-primary">beratung@oeh-wu.at</a>, und wir
            werden sie so schnell wie möglich hinzufügen. Vielen Dank für dein Verständnis!
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Ok" color="primary" @click="profNotFound = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { useLvStore } from '@/stores/lv.store'
import { useUserStore } from '@/stores/user.store'
import { useProfStore } from '@/stores/prof.store'
import { ref, computed, onMounted } from 'vue'
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

    // Funktion, um zu prüfen, ob der Kurs bereits hinzugefügt wurde
    const isCourseInUserCourses = (course) => {
      return userStore.user.course_entries.some(
        (c) => c.course_code === course.course_code && c.semester === course.semester
      )
    }

    const addCourseToUser = async (course) => {
      console.log(course)
      // Konvertiere die `start` und `end` Datumsfelder in `Date` Objekte
      const convertedCourse = {
        ...course,
        dates: course.dates.map((date) => ({
          ...date,
          start: new Date(date.start.$date),
          end: new Date(date.end.$date)
        }))
      }

      try {
        await userStore.addCourse(convertedCourse)
        userStore.fetchUser()
        console.log('Kurs erfolgreich hinzugefügt:', convertedCourse)
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Kurses:', error)
      }
    }

    const removeCourseFromUser = async (course) => {
      try {
        await userStore.deleteCourse(course.course_code, course.semester)
        console.log('Kurs erfolgreich entfernt:', course)
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
      } catch (error) {
        console.error('Fehler beim Laden der LVs:', error)
      } finally {
        loading.value = false
      }
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
      addCourseToUser,
      removeCourseFromUser,
      isCourseInUserCourses,
      filterFn,
      loading,
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
  }
}
</script>

<style scoped>
.q-card {
  width: 300px;
  margin: 10px;
}
</style>
