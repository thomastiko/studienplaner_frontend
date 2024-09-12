<template>
  <div v-if="this.surveyStore.userResult.length > 0">
    <div class="row justify-center">
      <!--<q-img id="rainbow" src="../assets/rainbow.svg" fit="contain" /> -->
      <div class="col-12 text-center q-mb-sm q-mt-lg">
        <div class="text-h4 text-orange-8 text-uppercase text-bold">
          {{ $t('resultpage.result') }}
        </div>
      </div>
      <div class="col-12 text-center q-mb-xl">
        <div class="text-h6 text-orange-8 text-bold">{{ $t('resultpage.sbwls_fits_best') }}:</div>
      </div>
      <div class="col-12 col-md-8 row items-end q-mb-xl q-mt-md">
        <div
          class="col-4 text-center"
          style="cursor: pointer; hyphens: auto; word-wrap: break-word; overflow-wrap: break-word"
          @click="goToSbwlDetail(rankedSBWLs.combinedDifferences[1].name)"
        >
          <div id="second-titel" :class="changeTextSize">
            {{ rankedSBWLs.combinedDifferences[1].name }}
          </div>
          <div
            id="second"
            class="col-12 row bg-orange-4 items-center justify-center"
            @mouseenter="changeTitleColor('second-titel')"
            @mouseleave="resetTitleColor('second-titel')"
          >
            <div class="text-h3 text-white">2</div>
          </div>
        </div>
        <div
          class="col-4 text-center"
          style="cursor: pointer; hyphens: auto; word-wrap: break-word; overflow-wrap: break-word"
          @click="goToSbwlDetail(rankedSBWLs.combinedDifferences[0].name)"
        >
          <div id="first-titel" :class="changeTextSize">
            {{ rankedSBWLs.combinedDifferences[0].name }}
          </div>
          <div
            id="first"
            class="col-12 row bg-orange-6 items-center justify-center"
            @mouseenter="changeTitleColor('first-titel')"
            @mouseleave="resetTitleColor('first-titel')"
          >
            <div class="text-h3 text-white">1</div>
          </div>
        </div>
        <div
          class="col-4 text-center"
          style="cursor: pointer; hyphens: auto; word-wrap: break-word; overflow-wrap: break-word"
          @click="goToSbwlDetail(rankedSBWLs.combinedDifferences[2].name)"
        >
          <div id="third-titel" :class="changeTextSize">
            {{ rankedSBWLs.combinedDifferences[2].name }}
          </div>
          <div
            id="third"
            class="col-12 row bg-orange-3 items-center justify-center"
            @mouseenter="changeTitleColor('third-titel')"
            @mouseleave="resetTitleColor('third-titel')"
          >
            <div class="text-h2 text-white">3</div>
          </div>
        </div>
      </div>
      <div class="col-12 row justify-center text-center q-mb-xl">
        <div class="col-12 text-h4 text-orange-8 text-uppercase text-bold q-mb-md">
          {{ $t('resultpage.evaluation') }}
        </div>
        <div class="col-12 col-md-10 text-body1 q-pa-sm">
          {{ $t('resultpage.evaluation_info_text') }}
          <a href="/sbwls" target="_blank"> {{$t('resultpage.here')}}.) </a>
        </div>
      </div>
      <div class="col-12 row justify-center q-pa-md q-col-gutter-md">
        <div class="row col-12 justify-center">
          <div class="col-12 col-md-6">
            <q-table
              style="height: 400px"
              flat
              bordered
              table-class="text-orange-8"
              card-class="text-orange-8"
              row-key="index"
              :rows="rankedSBWLs.combinedDifferences"
              virtual-scroll
              :rows-per-page-options="[0]"
              v-model:pagination="pagination"
              @row-click="onRowClick"
            >
              <template v-slot:top>
                <div class="row">
                  <div class="text-h6 col-12">{{ $t('resultpage.general_table') }}</div>
                  <div class="text-body text-grey-8">{{ $t('resultpage.general_info') }}</div>
                </div>
              </template>
              <template v-slot:header-cell="props">
                <q-th :props="props">
                  <q-icon
                    v-if="props.col.name == 'difference'"
                    name="info"
                    size="1.5em"
                    @click.stop="showDifferenceDialog = true"
                  />
                  {{ props.col.label }}
                </q-th>
              </template>
              <template v-slot:body-cell="props">
                <q-td :props="props">
                   <span v-if="props.col.name === 'name'">
                    {{props.pageIndex + 1}}.
                   </span>
                   {{ props.value}}
                  <q-icon
                    v-if="props.col.name === 'name'"
                    name="arrow_forward"
                    size="1.2em"
                    class="q-ml-sm"
                  />
                </q-td>
              </template>
            </q-table>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <q-table
            style="height: 400px"
            flat
            bordered
            table-class="text-orange-8"
            card-class="text-orange-8"
            row-key="index"
            :rows="rankedSBWLs.contentDifferences"
            virtual-scroll
            :rows-per-page-options="[0]"
            v-model:pagination="pagination"
            @row-click="onRowClick"
          >
            <template v-slot:top>
              <div class="row">
                <div class="text-h6 col-12">{{ $t('resultpage.content_table') }}</div>
                <div class="text-body text-grey-8">{{ $t('resultpage.content_info') }}</div>
              </div>
            </template>
            <template v-slot:header-cell="props">
              <q-th :props="props">
                <q-icon
                  v-if="props.col.name == 'difference'"
                  name="info"
                  size="1.5em"
                  @click.stop="showDifferenceDialog = true"
                />
                {{ props.col.label }}
              </q-th>
            </template>
            <template v-slot:body-cell="props">
              <q-td :props="props">
                <span v-if="props.col.name === 'name'">
                    {{props.pageIndex + 1}}.
                   </span>
                {{ props.value }}
                <q-icon
                  v-if="props.col.name === 'name'"
                  name="arrow_forward"
                  size="1.2em"
                  class="q-ml-sm"
                />
              </q-td>
            </template>
          </q-table>
        </div>
        <div class="col-12 col-md-6">
          <q-table
            style="height: 400px"
            flat
            bordered
            table-class="text-orange-8"
            card-class="text-orange-8"
            row-key="index"
            :rows="rankedSBWLs.formatDifferences"
            virtual-scroll
            :rows-per-page-options="[0]"
            v-model:pagination="pagination"
            @row-click="onRowClick"
          >
            <template v-slot:top>
              <div class="row">
                <div class="text-h6 col-12">{{ $t('resultpage.format_table') }}</div>
                <div class="text-body text-grey-8">{{ $t('resultpage.format_info') }}</div>
              </div>
            </template>

            <template v-slot:header-cell="props">
              <q-th :props="props">
                <q-icon
                  v-if="props.col.name == 'difference'"
                  name="info"
                  size="1.5em"
                  @click.stop="showDifferenceDialog = true"
                />
                {{ props.col.label }}
              </q-th>
            </template>
            <template v-slot:body-cell="props">
              <q-td :props="props">
                <span v-if="props.col.name === 'name'">
                    {{props.pageIndex + 1}}.
                   </span>
                {{ props.value }}
                <q-icon
                  v-if="props.col.name === 'name'"
                  name="arrow_forward"
                  size="1.2em"
                  class="q-ml-sm"
                />
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>

    <!-- Dialog for booster info -->
    <q-dialog v-model="showDifferenceDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ $t('resultpage.difference') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ $t('resultpage.difference_info') }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="deep-orange" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { getStudy } from '@/stores/index.js'
import { useSurveyStore } from '@/stores/survey.store'
import confetti from 'canvas-confetti'

export default {
  setup() {
    const surveyStore = useSurveyStore()
    const userStudies = surveyStore.userStudies.value
    const combinedStudies = ref([])

    if (userStudies && Array.isArray(userStudies)) {
      combinedStudies.value = getStudy(userStudies).filter((study) => {
        const studySet = new Set(Object.keys(study.study))
        return userStudies.every((userStudy) => studySet.has(userStudy))
      })
    }
    return {
      surveyStore,
      combinedStudies,
      showDifferenceDialog: ref(false),
      pagination: ref({
        rowsPerPage: 0
      })
    }
  },
  methods: {
    onRowClick(evt, sbwl) {
      const selectedSbwl = this.combinedStudies.find((study) => study.name === sbwl.name)
      this.$router.push({ name: 'SBWLDetail', params: { name: selectedSbwl.name } })
    },
    changeTitleColor(id) {
      document.getElementById(id).style.transform = 'scale(1.2)'
    },
    resetTitleColor(id) {
      document.getElementById(id).style.transform = 'scale(1)'
    },
    goToSbwlDetail(sbwlName) {
      const sbwl = this.combinedStudies.find((study) => study.name === sbwlName)
      this.$router.push({ name: 'SBWLDetail', params: { name: sbwl.name } })
    },
    startConfetti() {
      // Beispiel für einen einfachen Konfetti-Regen
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    },
    async sendSurvey() {
      if (this.surveyStore.userResult.length > 0) {
        try {
          // Holen der kombinierten Unterschiede
          const combinedDifferences = this.rankedSBWLs.combinedDifferences.map((sbwl) => sbwl.name)
          // Setzen des Spezialisierungsarrays im Store
          this.surveyStore.addSpezialization(combinedDifferences)
          // Absenden der Umfrage
          await this.surveyStore.submitSurvey()
        } catch (error) {
          console.error('Error in submitSurveyIfNeeded:', error)
        }
      }
    }
  },
  computed: {
    rankedSBWLs() {
      const userResults = this.surveyStore.userResult

      // Arrays für jeden Typ von Frage
      const contentDifferences = []
      const formatDifferences = []
      const combinedDifferences = []

      // Iteriere über alle SBWLs in combinedStudies
      this.combinedStudies.forEach((sbwl) => {
        let contentDifference = 0
        let formatDifference = 0

        if (sbwl.name !== 'Courses Abroad') {
          // Iteriere über die Antworten des Benutzers
          userResults.forEach((answer) => {
            const question = answer.id

            // Finde das entsprechende Objekt in der evaluation der SBWL
            const evalObj = sbwl.evaluation.find((obj) => obj.id === question)

            if (evalObj) {
              // Berechne die Differenz basierend auf dem Typ der Frage
              let difference = Math.abs(answer.weight - evalObj.answer)

              // Verdopple die Differenz, wenn der Wert boost: true ist
              if (answer.boost) {
                difference *= 2
              }

              if (evalObj.type === 'content') {
                contentDifference += difference
              } else if (evalObj.type === 'format') {
                formatDifference += difference
              }
            }
          })

          // Füge die Differenzen zur entsprechenden Array hinzu
          contentDifferences.push({ name: sbwl.name, difference: contentDifference })
          formatDifferences.push({ name: sbwl.name, difference: formatDifference })
          combinedDifferences.push({
            name: sbwl.name,
            difference: contentDifference + formatDifference
          })
        }
      })

      // Sortiere die Arrays nach der Summe der Differenzen
      contentDifferences.sort((a, b) => a.difference - b.difference)
      formatDifferences.sort((a, b) => a.difference - b.difference)
      combinedDifferences.sort((a, b) => a.difference - b.difference)

      // Runde die Differenzen auf zwei Nachkommastellen
      const roundTwoDecimals = (array) =>
        array.map((item) => ({ ...item, difference: parseFloat(item.difference.toFixed(2)) }))
      return {
        contentDifferences: roundTwoDecimals(contentDifferences),
        formatDifferences: roundTwoDecimals(formatDifferences),
        combinedDifferences: roundTwoDecimals(combinedDifferences)
      }
    },
    changeTextSize() {
      return this.$q.platform.is.desktop
        ? 'text-body1 text-bold q-mb-md'
        : 'text-body1 text-bold q-mb-md'
    }
  },
  mounted() {
    this.startConfetti()
    this.sendSurvey()
  }
}
</script>

<style>
#first {
  height: 200px;
  border-radius: 20px 20px 0 0;
  transition: filter 0.3s ease;
}
#first:hover,
#second:hover,
#third:hover {
  filter: brightness(1.2);
}
#first-titel,
#second-titel,
#third-titel {
  transition: all 0.3s ease;
}
#second {
  height: 150px;
  border-radius: 20px 0 0 0;
  transition: filter 0.3s ease;
}
#third {
  height: 100px;
  border-radius: 0 20px 0 0;
  transition: filter 0.3s ease;
}
#rainbow {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  opacity: 15%;
  max-height: 100vh;
}
</style>
