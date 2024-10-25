<template>
  <div>
    <div class="row q-ma-md" v-if="profStore.selectedProf">
      <div class="col-12 text-h3 text-center q-mb-sm">
        {{ profStore.selectedProf.fname }} {{ profStore.selectedProf.lname }}
      </div>
      <div class="col-12 text-center q-mb-lg">
        <q-btn
          v-if="userStore.loggedIn"
          label="Jetzt bewerten"
          @click="rateProfessor"
          style="background-color: #ffee6c"
        />
        <div v-else class="text-body1">Melde dich an um eine Bewertung abgeben zu können!</div>
      </div>
      <div class="col-12 row" v-for="(factor, i) in profStore.selectedProf.factors" :key="i">
        <div class="col-12 row justify-center q-gutter-sm" v-if="factor.ratings > 0 && factor.gesamt !== null && factor.lerninhahlte !== null && factor.atmospahre !== null && factor.benotung !== null && factor.verfugbarkeit !== null && factor.empfhelung !== null">
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
                <div class="text-h4">{{ factor.ratings }}</div>
                <div class="text-subtitle2">Bewertungen</div>
              </div>
            </q-card-section>
          </q-card>
          <div class="col-12 text-h4">Kommentare:</div>
          <div class="col-12" v-if="profStore.selectedProf.comments.length > 0">
            <q-list bordered separator>
              <q-item v-for="(comment, i) in profStore.selectedProf.comments" :key="i">
                <q-item-section>
                  <div v-if="userStore.loggedIn && userStore.user.role === 'admin'">
                    <q-btn color="negative" label="Löschen" @click="confirm = true" />
                  </div>
                  <div class="text-caption">{{ formatDate(comment.date) }}</div>
                  <div class="text-body1">{{ comment.text }}</div>
                  <!-- Dialog für Kommentar löschen -->
                  <q-dialog v-model="confirm">
                    <q-card>
                      <q-card-section class="row items-center">
                        <div>Willst du dieses Kommentar wirklich unwiderruflich löschen?</div>
                      </q-card-section>

                      <q-card-actions align="right">
                        <q-btn flat label="Abbrechen" color="primary" v-close-popup />
                        <q-btn
                          flat
                          label="Löschen"
                          color="negative"
                          v-close-popup
                          @click="deleteComment(comment)"
                        />
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-12" v-else>
            <div class="text-center text-h5">Noch keine Kommentare vorhanden</div>
          </div>
        </div>
        <div class="col-12" v-else>
          <div class="text-center text-h5">Noch keine Bewertung vorhanden</div>
          <div class="text-center text-h6">Sei die erste Person, die diese Lehrkraft bewertet</div>
        </div>
      </div>
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
    // Methode zum Formatieren des Datums
    const formatDate = (dateInput) => {
      // Überprüfen, ob das Datum bereits das richtige Format hat (dd.MM.yyyy, hh:mm)
      const regex = /^\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}$/
      if (regex.test(dateInput)) {
        return dateInput
      }

      // Falls nicht, formatieren wir das Datum
      const date = new Date(dateInput)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      return `${day}.${month}.${year}, ${hours}:${minutes}`
    }

    return {
      profStore,
      userStore,
      profId,
      rateProfessor,
      formatDate,
      confirm: ref(false)
    }
  },
  methods: {
    deleteComment(comment) {
      this.profStore.deleteComment(this.profStore.selectedProf._id, comment)
    }
  }
}
</script>

<style></style>
