<template>
  <div>
    <div class="row q-ma-md" v-if="profStore.selectedProf">
      <div class="col-12 text-h3 text-center q-mb-sm">
        {{ profStore.selectedProf.fname }} {{ profStore.selectedProf.lname }}
      </div>
      <div class="col-12 text-center q-mb-lg">
        <q-btn v-if="userStore.loggedIn" label="Jetzt bewerten" @click="rateProfessor" style="background-color: #FFEE6C;"/>
        <div v-else class="text-body1">Melde dich an um eine Bewertung abgeben zu können!</div>
      </div>
      <div class="col-12 row" v-for="(factor, i) in profStore.selectedProf.factors" :key="i">
        <div class="col-12 row justify-center q-gutter-sm" v-if="factor.ratings > 0">
        <q-card class="row items-center bg-amber-2">
          <q-card-section class="text-center">
            <div class="text-h3">{{ factor.gesamt.toFixed(2) }}</div>
            <div class="text-subtitle2">Gesamt</div>
          </q-card-section>
        </q-card>
        <q-card>
          <q-card-section class="col-12 row">
            <div class="col-6 col-sm-4 text-center">
            <div class="text-h4">{{ factor.lerninhahlte.toFixed(2) }}</div>
            <div class="text-subtitle2">Lerninhalt und -aufbereitung</div>
          </div>
          <div class="col-6 col-sm-4 text-center">
            <div class="text-h4">{{ factor.atmospahre.toFixed(2) }}</div>
            <div class="text-subtitle2">Atmosphäre</div>
          </div>
          <div class="col-6 col-sm-4 text-center">
            <div class="text-h4">{{ factor.benotung.toFixed(2) }}</div>
            <div class="text-subtitle2">Benotung</div>
          </div>
          <div class="col-6 col-sm-4 text-center">
            <div class="text-h4">{{ factor.verfugbarkeit.toFixed(2) }}</div>
            <div class="text-subtitle2">Verfügbarkeit</div>
          </div>
          <div class="col-6 col-sm-4 text-center">
            <div class="text-h4">{{ factor.empfhelung.toFixed(2) }}</div>
            <div class="text-subtitle2">Empfehlung</div>
          </div>
          <div class="col-6 col-sm-4 text-center">
            <div class="text-h4">{{ factor.ratings }} </div>
            <div class="text-subtitle2">Bewertungen</div>
          </div>
          </q-card-section>
        </q-card>
        </div>
        <div v-else>
          <p>No ratings yet.</p>
        </div>
      </div>
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
