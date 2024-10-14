<template>
  <div>
    <div class="row q-ma-md">
      <div class="text-h3 text-weight-medium q-mb-sm col-12">LVs hinzufügen</div>
      <div class="col-12">
        <q-select
          filled
          v-model="selectedSubject"
          use-input
          clearable
          :options="filteredOptions"
          @filter="filterFn"
          label="Select Subject"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <!-- Zeige die gefilterten Kurse an -->
      <div v-if="filteredCourses.length" class="row">
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
                  {{ prof }}
                </q-btn>
              </div>
            </div>
            <q-separator />
            <div class="row justify-between q-pa-sm">
              <div class="text-blue-7">
                Modus <q-tooltip>{{ course.course_mode }}</q-tooltip>
              </div>
              <div class="text-blue-7">
                <a
                  :href="course.vvz_url"
                  target="_blank"
                  class="text-blue-7"
                  style="text-decoration: none"
                >
                  VVZ
                </a>
                <q-tooltip>{{ course.comment }}</q-tooltip>
              </div>
              <div class="text-blue-7">
                Sprache <q-tooltip>{{ course.language }}</q-tooltip>
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
  <q-dialog v-model="showProfPreview">
    <q-card>
      <q-card-section>
        <q-card-title>Professoren-Vorschau</q-card-title>
        <q-btn label="zum Prof" @click="goToProf" />
      </q-card-section>
      <q-card-section>
        Name: {{ this.profStore.profPreview.fname }} {{ this.profStore.profPreview.lname }}
      </q-card-section>
      <q-card-section>
        Bewertung:
        <ul v-if="this.profStore.profPreview.factors.length > 0">
          <li>Ratings: {{ profStore.profPreview.factors[0].ratings }}</li>
          <li>Kommentare: {{ profStore.profPreview.factors[0].comments }}</li>
          <li>Lerninhalte: {{ profStore.profPreview.factors[0].lerninhahlte }}</li>
          <li>Atmosphäre: {{ profStore.profPreview.factors[0].atmospahre }}</li>
          <li>Mitarbeit: {{ profStore.profPreview.factors[0].mitarbeit }}</li>
          <li>Benotung: {{ profStore.profPreview.factors[0].benotung }}</li>
          <li>Verfügbarkeit: {{ profStore.profPreview.factors[0].verfugbarkeit }}</li>
          <li>Empfehlung: {{ profStore.profPreview.factors[0].empfhelung }}</li>
          <li>Gesamtbewertung: {{ profStore.profPreview.factors[0].gesamt }}</li>
        </ul>
      </q-card-section>
      <q-card-section>
        Kommentare:
        <ul v-if="this.profStore.profPreview.comments.length > 0">
          <li v-for="comment in profStore.profPreview.comments" :key="comment._id.$oid">
            {{ comment.text }} ({{ comment.date }})
          </li>
        </ul>
      </q-card-section>
      <q-card-section> </q-card-section>
    </q-card>
  </q-dialog>
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

    const courses = computed(() => lvStore.list || [])

    const uniqueSubjectNames = computed(() => {
      return [...new Set(courses.value.map((course) => course.subject_name))]
    })

    const filteredCourses = computed(() => {
      if (!selectedSubject.value) {
        return []
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
      try {
        await userStore.addCourse(course)
        console.log('Kurs erfolgreich hinzugefügt:', course)
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

    onMounted(() => {
      lvStore.fetchCourses()
      filteredOptions.value = uniqueSubjectNames.value
    })

    return {
      lvStore,
      userStore,
      profStore,
      showProfPreview: ref(false),
      selectedSubject,
      filteredOptions,
      filteredCourses,
      addCourseToUser,
      removeCourseFromUser,
      isCourseInUserCourses,
      filterFn,
      formatDateRange(dateStart, dateEnd) {
        const start = new Date(dateStart)
        const end = new Date(dateEnd)
        const options = {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }
        const formattedStart = start.toLocaleString(undefined, options)
        const formattedEnd = end.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' })
        return `${formattedStart} - ${formattedEnd}`
      }
    }
  },
  methods: {
    async previewProf(prof) {
      // Entfernt alle gängigen Titel und Grad-Abkürzungen vor oder nach dem Namen
      const titles =
        /((Assoz\.Prof\.|Ass\.Prof\.|Prof\.?|Dr\.?|Univ\.|PD|LL\.M\.?|M\.Sc\.?|MBA|PhD|Ph\.D\.|Mag\.?|Dipl\.-Vw\.?|MSc\(WU\)|MSc|MA|BA|WU|M\.A\.)(\s|\.?|,?))+/g

      // Entfernt die Titel sowie überflüssige Kommata, behält aber den Namen
      const nameWithoutTitles = prof.replace(titles, '').replace(/,\s*,/, '').trim()

      // Entfernt Klammern, die leer oder nur Platzhalter enthalten, sowie überflüssige Kommata am Ende
      const cleanName = nameWithoutTitles
        .replace(/\(\s*\)/, '')
        .replace(/,\s*$/, '')
        .trim()

      // Den vollständigen Namen in Vorname und Nachname aufteilen, indem Leerzeichen als Trennzeichen genutzt werden
      const nameParts = cleanName.split(/\s+/)

      // Vorname ist das erste Element, Nachname der Rest
      const fname = nameParts[0] // Vorname (erste Teil)
      const lname = nameParts.slice(1).join(' ') // Nachname (alles nach dem ersten Teil)

      // Ausgabe zur Kontrolle
      console.log(`Vorname: ${fname}, Nachname: ${lname}`)
      const obj = { fname, lname }

      await this.profStore.fetchProfPreview(obj)
      this.showProfPreview = true
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
