<template>
  <div>
    <div class="row q-ma-md" v-if="profStore.selectedProf">
      <div class="col-12 text-h4 q-mb-md">
        {{ $t('rateProf.rate') }}: {{ profStore.selectedProf.fname }}
        {{ profStore.selectedProf.lname }}
      </div>
      <div class="col-12 col-md-8 row q-col-gutter-md">
        <div class="col-12">
          <div class="text-body1 row items-center">
            <span class="q-pr-xs">1</span>
            <q-icon name="star" color="amber-6" size="1em" />
            <div class="q-pl-xs">= {{$t('profcheck.applies_not_at_all')}}</div>
          </div>
        </div>
        <div class="col-12">
          <div class="text-body1 row items-center">
            <span class="q-pr-xs">5</span>
            <q-icon name="star" color="amber-6" size="1em" />
            <div class="q-pl-xs">= {{$t('profcheck.completely_applies')}}</div>
          </div>
        </div>
        <div class="col-xs-12 col-md-4" v-for="(factor, i) in rateSystem" v-bind:key="i">
          <div class="q-pa-md shadow-1" style="min-height: 160px">
            <div class="text-h5 q-mb-md">{{ factor.title }}</div>
            <div class="text-body1">{{ factor.criteria }}</div>
            <q-rating
              v-model="factor.value"
              icon="star"
              size="2em"
              :max="5"
              color="amber-6"
            ></q-rating>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-8 row q-mt-lg">
        <div class="col-12 text-h4 q-mb-sm">{{ $t('rateProf.add_comment') }}:</div>
        <q-input class="full-width" v-model="comment" outlined autogrow :placeholder="$t('profcheck.placeholder')" />
      </div>
      <div class="col-12">
      <q-btn
        class="q-mt-md"
        :label="$t('rateProf.send_rating')"
        color="primary"
        @click="updateRate"
      />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import { useProfStore } from '@/stores/prof.store'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
export default {
  props: ['prof_id'],
  setup(props) {
    const route = useRoute()
    const userStore = useUserStore()
    const profStore = useProfStore()
    const { t, locale } = useI18n()
    const q = useQuasar()
    const profId = ref(
      props.prof_id || route.params.prof_id || window.location.pathname.split('/')[2]
    )
    watch(locale, (newLocale, oldLocale) => {
      if (newLocale !== oldLocale) {
        window.location.reload() // Seite neu laden
      }
    })
    const rateSystem = ref([
      {
        title: t('lvPlaner.prof_learning_content'),
        criteria: t('rateProf.learning_content_text'),
        value: 0
      },
      {
        title: t('lvPlaner.prof_atmosphere'),
        criteria: t('rateProf.atmosphere_text'),
        value: 0
      },
      {
        title: t('lvPlaner.prof_participation'),
        criteria: t('rateProf.participation_text'),
        value: 0
      },
      {
        title: t('lvPlaner.prof_grading'),
        criteria: t('rateProf.grading_text'),
        value: 0
      },
      {
        title: t('lvPlaner.prof_availability'),
        criteria: t('rateProf.availability_text'),
        value: 0
      },
      {
        title: t('lvPlaner.prof_recommendation'),
        criteria: t('rateProf.recommendation_text'),
        value: 0
      }
    ])
    onMounted(async () => {
      await profStore.findProf(profId.value)
    })

    return {
      userStore,
      profStore,
      comment: ref(''),
      rateSystem,
      q
    }
  },
  methods: {
    async updateRate() {
      const ratings = this.rateSystem.map((factor) => factor.value) // Sammle alle Bewertungen
      const comment = this.comment // Hole den Kommentar

      // Erstelle ein Objekt, das die Ratings und den Kommentar enthält
      const ratingData = {
        ratings,
        comment
      }

      try {
        // Übergebe das `profId` und die Bewertungen/Kommentare an die Funktion, die mit dem Backend interagiert
        await this.profStore.rateProfessor(
          this.profStore.selectedProf._id,
          ratingData,
          this.$router,
          this.q.notify
        )
      } catch (error) {
        console.error('Fehler beim Hinzufügen der Bewertung:', error)
      } 
    }
  }
}
</script>

<style></style>
