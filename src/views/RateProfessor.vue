<template>
  <div>
    <div class="row q-ma-md" v-if="profStore.selectedProf">
      <div class="col-12 text-h4">
        {{ $t('rateProf.rate') }}: {{ profStore.selectedProf.fname }} {{ profStore.selectedProf.lname }}
      </div>
      <div class="col-xs-12 col-md-6" v-for="(factor, i) in rateSystem" v-bind:key="i">
        <div class="q-pa-md shadow-1">
          <h4>{{ factor.title }}</h4>
          <p>{{ factor.criteria }}</p>
          <q-rating
            v-model="factor.value"
            icon="thumb_up"
            size="2em"
            :max="5"
            color="primary"
          ></q-rating>
        </div>
      </div>
      <div class="col-12 row q-mt-md">
        <div class="col-12 text-h4"> {{ $t('profcheck.add_comment') }} :</div>
        <q-input class="full-width" v-model="comment" outlined autogrow />
      </div>
      <q-btn class="q-mt-md" :label="$t('profcheck.send_rating')" color="primary" @click="updateRate" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import { useProfStore } from '@/stores/prof.store'
import { onMounted } from 'vue'
export default {
  props: ['prof_id'],
  setup(props) {
    const route = useRoute()
    const userStore = useUserStore()
    const profStore = useProfStore()
    const profId = ref(
      props.prof_id || route.params.prof_id || window.location.pathname.split('/')[2]
    )
    onMounted(async () => {
      await profStore.findProf(profId.value)
    })

    return {
      userStore,
      profStore,
      comment: ref(''),
      rateSystem: ref([
        {
          title: `${this.$t('lvPlaner.prof_learning_content')}`,
          criteria: `${this.$t('rateProf.learning_content_text')}`,
          value: 0
        },
        {
          title: `${this.$t('lvPlaner.prof_atmosphere')}`,
          criteria: `${this.$t('rateProf.atmosphere_text')}`,
          value: 0
        },
        {
          title: `${this.$t('lvPlaner.prof_participation')}`,
          criteria: `${this.$t('rateProf.participation_text')}`,
          value: 0
        },
        {
          title: `${this.$t('lvPlaner.prof_grading')}`,
          criteria: `${this.$t('rateProf.grading_text')}`,
          value: 0
        },
        {
          title: `${this.$t('lvPlaner.prof_availability')}`,
          criteria: `${this.$t('rateProf.availability_text')}`,
          value: 0
        },
        { title: `${this.$t('lvPlaner.prof_recommendation')}`, criteria: `${this.$t('rateProf.recommendation')}` , value: 0 }
      ])
    }
  },
  methods: {
    async updateRate() {
      const ratings = this.rateSystem.map((factor) => factor.value) // Sammle alle Bewertungen
      const comment = this.comment // Hole den Kommentar

      console.log(ratings) // Nur für Debugging, um sicherzustellen, dass die Bewertungen korrekt gesammelt werden
      console.log(comment)

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
          this.$router
        )
      } catch (error) {
        console.error('Fehler beim Hinzufügen der Bewertung:', error)
      }
    }
  }
}
</script>

<style></style>
