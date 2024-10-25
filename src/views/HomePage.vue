<template>
  <div>
    <div class="container">
      <div class="text-h1 text-center text-weight-medium text-uppercase q-mb-sm q-mt-md">
        Studien&shy;planer
      </div>
      <div class="text-h5 text-center text-weight-medium text-uppercase q-mb-lg">
        das Tool für dein Studium
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
              So unterstützen wir dich
            </div>
            <div class="text-h5 text-center" id="heading-info-h2">
              <!--Complete your studies with ease -->
              Meistere dein Studium mit Leichtigkeit
            </div>
          </div>
        </div>
        <div :class="colGutter">
          <div class="col-md-4 col-xs-12" style="max-width: 600px">
            <q-card
              ref="card3"
              class="my-card full-height"
              style="background-color: transparent"
              @mouseover="expandImage(3)"
              @mouseleave="shrinkImage(3)"
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
                <div class="text-h5 text-center text-weight-bold" id="heading-mycard">
                  Studienplaner
                </div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <div class="text-body1 text-start" id="text-mycard">
                  Ein Studium voller Meilensteine mit deinem ÖH WU Studienplaner! Der Studienplaner
                  stellt deine Kurse graphisch in Sequenzen dar, macht ECTS unkompliziert planbar
                  und lässt dich Kursvoraussetzungen schnell und einfach überprüfen. Nie wieder
                  Voraussetzungsfallen und nie wieder ECTS-Dilemma mit deinem Studienplaner!
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-4 col-xs-12" style="max-width: 600px">
            <q-card
              ref="card1"
              class="my-card full-height"
              style="background-color: transparent"
              @mouseover="expandImage(1)"
              @mouseleave="shrinkImage(1)"
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
                <div class="text-body1 text-start" id="text-mycard">
                  Schreite zielstrebig und effizient voran mit dem ÖH WU LV-Planer! Stell dein
                  perfektes Semester mit wenigen Klicks aus dem VVZ-Kursangebot zusammen und lade es
                  dir gleich praktisch in deinen Kalender – Terminüberschneidungen waren gestern,
                  Turbo im Studium heute mit deinem LV-Planer!
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-4 col-xs-12" style="max-width: 600px">
            <q-card
              ref="card2"
              class="my-card full-height"
              style="background-color: transparent"
              @mouseover="expandImage(2)"
              @mouseleave="shrinkImage(2)"
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
                <div class="text-body1 text-start" id="text-mycard">
                  Ist die Vorlesung der Hit oder doch eher Bockmist? Teil es uns mit, mit dem ÖH WU
                  ProfCheck! Hier kannst du direkt Lehrende und ihre Lehrveranstaltungen nach
                  verschiedenen Kriterien bewerten und uns deine Meinung dazu hinterlassen. Damit
                  unterstützt du uns und all deine Mitstudierenden in unserem Bestreben nach mehr
                  Fairness, Transparenz und Qualität im Studium.
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
                  <div class="text-h3 text-center text-weight-medium text-uppercase q-mb-lg">
                    Deine ÖH WU
                  </div>
                </div>
              </q-card-section>
              <q-card-section>
                <div class="text-h5">
                  Wir, die Österreichische Hochschülerschaft der Wirtschaftsuniversität Wien, sind
                  deine gesetzlich verankerte Interessensvertretung auf unserer Universität. Wir
                  setzen uns gegenüber allen Stakeholdern der WU – sei‘s Rektorat, Bib-Management
                  oder Mensa – für deine Anliegen ein und kämpfen somit täglich für mehr Qualität &
                  Fairness auf unserer WU, damit das Studium die schönste Zeit deines Lebens wird!
                </div>
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
export default {
  components: {},
  setup() {
    const q = useQuasar()
    return {
      q
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
    expandImage(cardId) {
      if (this.$q.platform.is.desktop) {
        let img = this.$refs[`card${cardId}`]
        img.$el.style.transition = 'transform 0.6s ease'
        img.$el.style.transform = 'scale(1.2)'
        img.$el.style.zIndex = '2'
        img.$el.style.backgroundColor = 'white'
      }
    },
    shrinkImage(cardId) {
      if (this.$q.platform.is.desktop) {
        let img = this.$refs[`card${cardId}`]
        img.$el.style.transition = 'transform 0.6s ease'
        img.$el.style.transform = 'scale(1)'
        img.$el.style.zIndex = '1'
        img.$el.style.backgroundColor = 'transparent'
      }
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
