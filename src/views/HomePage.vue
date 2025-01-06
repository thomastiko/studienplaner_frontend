<template>
  <div>
    <div class="container">
      <div class="text-h1 text-center text-weight-medium text-uppercase q-mb-sm q-mt-md">
        Studien&shy;planer
      </div>
      <div class="text-h5 text-center text-weight-medium text-uppercase q-mb-lg">
        {{ $t('homePage.subtitle_1') }}
      </div>
      <div :class="bg"></div>
      <div class="info q-pa-md">
        <div class="row q-mb-xl row wrap justify-center">
          <div class="col-md-12">
            <div
              class="text-h3 text-center text-weight-medium text-uppercase q-mb-lg"
              id="heading-info-h5"
            >
              <!--How we can support you-->
              {{ $t('homePage.heading_2') }}
            </div>
            <div class="text-h5 text-center" id="heading-info-h2">
              <!--Complete your studies with ease -->
              {{ $t('homePage.subtitle_2') }}
            </div>
          </div>
        </div>
        <div :class="colGutter">
          <div class="col-md-4 col-xs-12" style="max-width: 600px">
            <q-card
              ref="card3"
              class="my-card full-height no-shadow"
              style="background-color: transparent"
            >
              <q-card-section class="q-pa-md">
                <q-img
                  class="card-image"
                  src="../assets/notebook-straight.svg"
                  :fit="(scale - down).toFixed(0)"
                  style="max-height: 150px"
                ></q-img>
              </q-card-section>
              <q-card-section>
                <div class="text-h5 text-center text-weight-bold" id="heading-mycard">Notebook</div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <div class="text-body1 text-center" id="text-mycard">
                  {{ $t('homePage.studienplaner_card') }}
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-4 col-xs-12" style="max-width: 600px">
            <q-card
              ref="card1"
              class="my-card full-height no-shadow"
              style="background-color: transparent"
            >
              <q-card-section class="q-pa-md">
                <q-img
                  class="card-image"
                  src="../assets/lv-planer-color-2.svg"
                  :fit="(scale - down).toFixed(0)"
                  style="max-height: 150px"
                ></q-img>
              </q-card-section>
              <q-card-section>
                <div class="text-h5 text-center text-weight-bold" id="heading-mycard">
                  LV-Planer
                </div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <div class="text-body1 text-center" id="text-mycard">
                  {{ $t('homePage.lvplaner_card') }}
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-4 col-xs-12" style="max-width: 600px">
            <q-card
              ref="card2"
              class="my-card full-height no-shadow"
              style="background-color: transparent"
            >
              <q-card-section class="q-pa-md">
                <q-img
                  class="card-image"
                  src="../assets/profcheck-color-3.svg"
                  :fit="(scale - down).toFixed(0)"
                  style="max-height: 150px"
                ></q-img>
              </q-card-section>
              <q-card-section>
                <div class="text-h5 text-center text-weight-bold" id="heading-mycard">
                  Profcheck
                </div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <div class="text-body1 text-center" id="text-mycard">
                  {{ $t('homePage.profcheck_card') }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <div class="oeh-intro">
        <q-card flat class="transparent">
          <div class="row">
            <div class="col-md-6 col-xs-12">
              <q-card-section class="q-mx-xl">
                <q-img
                  src="../assets/group.svg"
                  :fit="(scale - down).toFixed(0)"
                  style="max-height: 550px"
                ></q-img>
              </q-card-section>
            </div>
            <div class="col-md-6 col-xs-12">
              <q-card-section>
                <div class="col-md-12">
                  <div class="text-h3 text-center text-weight-medium text-uppercase">
                    {{ $t('homePage.heading_3') }}
                  </div>
                </div>
              </q-card-section>
              <q-card-section>
                <div class="text-h6">
                  {{ $t('homePage.subtitle_3') }}
                </div>
              </q-card-section>
              <q-card-section>
                <q-btn
                  color="primary"
                  label="Jetzt OAuth testen"
                  @click="startOAuth"
                  class="q-mt-lg"
                />
              </q-card-section>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { getOAuthUrl } from '@/stores/config.js'; 
export default {
  components: {},
  setup() {
    const q = useQuasar()
    const scale = 1
    const down = 0.5

    return {
      q,
      scale,
      down,
    }
  },
  computed: {
    bg() {
      return !this.q.screen.lt.md ? 'bg' : ' '
    },
    bg2() {
      return !this.q.screen.lt.md ? 'bg-2' : ' '
    },
    layout() {
      return this.$q.screen.lt.sm ? 'dense' : this.$q.screen.lt.md ? 'comfortable' : 'loose'
    },
    colGutter() {
      return 'row wrap justify-center q-mt-xl q-col-gutter-md'
    }
  },
  methods: {
    startOAuth() {
      window.location.href = getOAuthUrl();
    }
  }
}
</script>

<style scoped>
.bg {
  position: absolute;
  width: 100%;
  height: 120vh;
  left: -20%;
  background-image: url('../assets/bg.svg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  z-index: -1;
  opacity: 0.2;
}
.bg-2 {
  position: absolute;
  right: 0;
  width: 70%;
  height: 150vh;
  background-image: url('../assets/bg-2.svg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  z-index: -1;
  opacity: 0.2;
}
</style>
