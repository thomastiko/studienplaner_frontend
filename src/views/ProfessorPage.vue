<template>
  <div>
    <div class="row q-ma-md" v-if="profStore.selectedProf">
      <div class="col-12 col-md-6 row my-fixed-height-2">
        <div class="col-12 row items-center q-gutter-sm q-mb-lg">

          <!-- Admin delete Button (falls Rolle == 'admin') -->
          <div v-if="userStore.loggedIn && userStore.user.role === 'admin'" class="q-mt-md">
            <q-btn label="Professor löschen" color="negative" @click="confirmAll = true" />
            <q-dialog v-model="confirmAll">
              <q-card>
                <q-card-section class="row items-center">
                  <div>Willst du diesen Professor wirklich unwiderruflich löschen?</div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="Abbrechen" color="primary" v-close-popup />
                  <q-btn
                    flat
                    label="Löschen"
                    color="negative"
                    v-close-popup
                    @click="deleteProfessor(profStore.selectedProf._id)"
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>

          <div class="col-12 row">
            <div class="text-h4 text-bold q-mr-sm">
              {{ profStore.selectedProf.fname }} {{ profStore.selectedProf.lname }}
            </div>
            <q-rating
              v-model="profStore.selectedProf.factors[0].gesamt"
              size="2em"
              icon="star_border"
              icon-selected="star"
              icon-half="star_half"
              color-half="amber-6"
              color-selected="amber-6"
              color="amber-8"
              readonly
            />
          </div>
          <div class="col-12 text-body1">
            {{$t('profcheck.based_on')}}  <strong>{{ profStore.selectedProf.factors[0].ratings }} </strong> {{$t('profcheck.ratings')}} 
          </div>
        </div>

        <div class="col-12 row items-center q-gutter-sm q-mb-lg"></div>
        <div
          class="col-12 col-md-8 row q-mb-lg"
          v-for="(factor, i) in profStore.selectedProf.factors"
          :key="i"
        >
          <div
            class="row q-col-gutter-sm"
            v-if="
              factor.ratings > 0 &&
              factor.gesamt !== null &&
              factor.lerninhahlte !== null &&
              factor.atmospahre !== null &&
              factor.benotung !== null &&
              factor.verfugbarkeit !== null &&
              factor.empfhelung !== null
            "
          >
            <div class="col-6 col-md-4">
              <q-card class="text-center q-pa-sm">
                <div class="text-h4 text-bold">{{ factor.lerninhahlte.toFixed(2) }}</div>
                <div class="text-subtitle2">{{ $t('lvPlaner.prof_learning_content') }}</div>
              </q-card>
            </div>
            <div class="col-6 col-md-4">
              <q-card class="text-center q-pa-sm">
                <div class="text-h4 text-bold">{{ factor.atmospahre.toFixed(2) }}</div>
                <div class="text-subtitle2">{{ $t('lvPlaner.prof_atmosphere') }}</div>
              </q-card>
            </div>
            <div class="col-6 col-md-4">
              <q-card class="text-center q-pa-sm">
                <div class="text-h4 text-bold">{{ factor.mitarbeit.toFixed(2) }}</div>
                <div class="text-subtitle2">{{ $t('lvPlaner.prof_participation') }}</div>
              </q-card>
            </div>
            <div class="col-6 col-md-4">
              <q-card class="text-center q-pa-sm">
                <div class="text-h4 text-bold">{{ factor.benotung.toFixed(2) }}</div>
                <div class="text-subtitle2">{{ $t('lvPlaner.prof_grading') }}</div>
              </q-card>
            </div>
            <div class="col-6 col-md-4">
              <q-card class="text-center q-pa-sm">
                <div class="text-h4 text-bold">{{ factor.verfugbarkeit.toFixed(2) }}</div>
                <div class="text-subtitle2">{{ $t('lvPlaner.prof_availability') }}</div>
              </q-card>
            </div>
            <div class="col-6 col-md-4">
              <q-card class="text-center q-pa-sm">
                <div class="text-h4 text-bold">{{ factor.empfhelung.toFixed(2) }}</div>
                <div class="text-subtitle2">{{ $t('lvPlaner.prof_recommendation') }}</div>
              </q-card>
            </div>
          </div>
        </div>
        <div class="col-12 column">
          <div class="text-h6">{{$t('profcheck.share_your_experience')}} </div>
          <div style="max-width: 380px">
            <div class="text-body1 q-mb-md">
              {{$t('profcheck.share_your_experience_text1')}}  <br />
              {{$t('profcheck.share_your_experience_text2')}}
            </div>
            <div>
              <q-btn
                class="full-width"
                v-if="userStore.loggedIn"
                :label="$t('profcheck.rate_now')"
                @click="rateProfessor"
                color="blue-4"
                outline
              />
              <div v-else class="text-body1 text-bold">{{ $t('profcheck.login_to_rate') }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 row my-fixed-height">
        <div class="col-12" v-if="profStore.selectedProf.comments.length > 0">
          <q-list separator>
            <q-item
              v-for="(comment, i) in profStore.selectedProf.comments"
              :key="i"
              class="q-mb-lg"
            >
              <q-item-section>
                <!-- Admin Delete Button -->
                <div v-if="userStore.loggedIn && userStore.user.role === 'admin'">
                  <q-btn color="negative" label="Löschen" @click="confirm = true" />
                </div>

                <div class="text-caption q-mt-lg">{{ formatDate(comment.date) }}</div>
                <div class="text-body1">{{ comment.text }}</div>
              </q-item-section>
            </q-item>
          </q-list>
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

    // prof_id aus Prop oder URL oder notfalls Fallback
    const profId = ref(props?.prof_id || route.params.prof_id || window.location.hash.split('/')[2])

    // Hier kommt das entscheidende onMounted
    onMounted(async () => {
      if (profId.value) {
        await profStore.findProf(profId.value)
      }
    })

    const rateProfessor = () => {
      router.push({ name: 'RateProfessor', params: { prof_id: profId.value } })
    }

    const formatDate = (dateInput) => {
      const regex = /^\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}$/
      if (regex.test(dateInput)) {
        return dateInput
      }
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
      confirm: ref(false),
      confirmAll: ref(false)
    }
  },
  methods: {
    deleteComment(comment) {
      this.profStore.deleteComment(this.profStore.selectedProf._id, comment)
    },
    async deleteProfessor(profId) {
      await this.profStore.deleteProfessor(profId)
      router.push({ name: 'Profcheck', route: '/profcheck' })
    }
  }
}
</script>

<style scoped>
/* Globale oder scoped CSS */
.my-fixed-height {
  max-height: 600px;
  overflow-y: auto;
}

/* Auf Handy-Breite (max 600px) setzen wir die Höhe wieder zurück */
@media (max-width: 600px) {
  .my-fixed-height {
    max-height: none;
  }
}

/* Globale oder scoped CSS */
.my-fixed-height-2 {
  max-height: 400px;
}

/* Auf Handy-Breite (max 600px) setzen wir die Höhe wieder zurück */
@media (max-width: 600px) {
  .my-fixed-height-2 {
    max-height: none;
  }
}
</style>
