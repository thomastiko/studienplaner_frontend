<template>
  <div>
    <div class="row q-ma-md" v-if="profStore.selectedProf">
      <div class="col-12 text-h4">
        Bewerten: {{ profStore.selectedProf.fname }} {{ profStore.selectedProf.lname }}
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
        <div class="col-12 text-h4">Kommentar hinzufügen:</div>
        <q-input class="full-width" v-model="comment" outlined autogrow />
      </div>
      <q-btn class="q-mt-md" label="Bewertung absenden" color="primary" />
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
          title: 'Lerninhalt und -aufbereitung',
          criteria: 'The lecturer is able to convey the course content in a comprehensible manner.',
          value: 0
        },
        {
          title: 'Atmosphäre',
          criteria: 'The atmosphere in the lecture is pleasant and friendly.',
          value: 0
        },
        {
          title: 'Mitarbeit',
          criteria: 'The presenter will involve the students in the presentation.',
          value: 0
        },
        {
          title: 'Benotung',
          criteria: 'Grading takes place in a fair and transparent manner.',
          value: 0
        },
        {
          title: 'Verfügbarkeit',
          criteria: 'The lecturer is sufficiently available for the students.',
          value: 0
        },
        { title: 'Empfehlung', criteria: 'I would recommend this presenter to others.', value: 0 }
      ])
    }
  }
}
</script>

<style></style>
