<template>
  <div>
    <div class="row q-ma-md" v-if="profStore.selectedProf">
      <div class="col-12 text-h4">
        {{ profStore.selectedProf.fname }} {{ profStore.selectedProf.lname }}
      </div>
      <div class="col-12">
        <q-btn v-if="userStore.loggedIn" label="Bewerten" @click="rateProfessor" />
      </div>
      <template v-for="(factor, i) in profStore.selectedProf.factors" :key="i">
        <div v-if="factor.ratings > 0">
          <div>Ratings: {{ factor.ratings }}</div>
          <div>Lerninhalt und -aufbereitung: {{ factor.lerninhahlte }}</div>
          <div>Atmosphäre: {{ factor.atmospahre }}</div>
          <div>Benotung: {{ factor.benotung }}</div>
          <div>Verfügbarkeit: {{ factor.verfugbarkeit }}</div>
          <div>Empfehlung: {{ factor.empfhelung }}</div>
          <div>Gesamt: {{ factor.gesamt }}</div>
        </div>
        <div v-else>
          <p>No ratings yet.</p>
        </div>
      </template>
      <div class="col-12 text-h4">Kommentare:</div>
      <q-list bordered separator>
        <q-item v-for="(comment, i) in profStore.selectedProf.comments" :key="i">
          <q-item-section> {{ comment.text }} </q-item-section>
          <q-item-section> {{ comment.date }} </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { useProfStore } from '@/stores/prof.store'
import { useUserStore } from '@/stores/user.store'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import router from '../router'
export default {
  props: ['prof_id'],

  setup(props) {
    const route = useRoute()
    const profStore = useProfStore()
    const userStore = useUserStore()
    const profId = ref(
      props.prof_id || route.params.prof_id || window.location.pathname.split('/')[2]
    )
    const rateProfessor = () => {
      router.push({ name: 'RateProfessor', params: { prof_id: profId.value } })
    }
    onMounted(async () => {
      await profStore.findProf(profId.value)
    })

    return {
      profStore,
      userStore,
      profId,
      rateProfessor
    }
  }
}
</script>

<style></style>
