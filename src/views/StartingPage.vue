<template>
  <div>
    <div class="bg-orange-8 q-pa-sm row items-center" style="min-height: 90vh">
      <div class="q-pt-xl">
        <div :class="headingMargin">
          <q-img v-if="!q.screen.lt.md" id="akzent" src="../assets/akzent.svg"  />
        <div :class="heading">Spezialisierungs-Finder</div>
        <q-img v-if="!q.screen.lt.md" id="akzent-flipped" src="../assets/akzent.svg" />
        </div>
        <div id="info" class="row justify-center q-ma-md">
          <div class="col-12 col-md-8 text-center text-white text-body1" v-html="$t('startingpage.info_text')">
          </div>
        </div>
        <div class="row justify-center q-mt-sm">
          <q-btn
            :label="$t('startingpage.starting_test_button')"
            color="white"
            rounded
            text-color="orange-8"
            size="lg"
            padding="sm lg"
            @click="startTest"
          />
        </div>
      </div>
      <q-img src="../assets/badge-header.svg" fit="fill" :style="badgeStyle" class="q-mb-lg" />
    </div>
    <div v-if="!this.q.screen.lt.md" class="wave-wrapper">
      <q-img src="../assets/bottom-wave.svg" id="wave" class="wave-animation" fit="fill" />
    </div>
    <div id="further-info" class="row justify-center q-mt-xl">
      <div class="col-12 col-md-8 q-mt-md">
        <div class="col-12 text-center text-h6 q-mb-lg">{{ $t('startingpage.further_info') }}:</div>
        <div class="col-12 row q-col-gutter-sm">
          <div class="col-12 col-md-4 row justify-center">
            <a href="src/assets/pdfs/einstiegsliste.pdf" target="_blank" style="text-decoration: none; color: black;">
            <q-card id="card-hover" flat class="bg-transparent">
              <q-img
                src="../assets/einstiegsliste.png"
                fit="scale-down"
                style="height: 300px"
                id="img-hover"
              >
              </q-img>
              <q-card-section>
                <div class="text-h6 text-center">Einstiegsliste</div>
                <div class="text-body1 text-center">{{ $t('startingpage.einstiegsliste') }}</div>
              </q-card-section>
            </q-card>
            </a>
          </div>
          <div class="col-12 col-md-4 row justify-center">
            <q-card id="card-hover" flat class="bg-transparent">
              <q-img
                src="../assets/nachfrageliste.png"
                fit="scale-down"
                style="height: 300px"
                id="img-hover"
              >
              </q-img>
              <q-card-section>
                <div class="text-h6 text-center">Nachfrageliste</div>
                <div class="text-body1 text-center">{{ $t('startingpage.nachfrageliste') }}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-4 row justify-center">
            <a href="src/assets/pdfs/meinungsbroschuere.pdf" target="_blank" style="text-decoration: none; color: black;">
            <q-card id="card-hover" flat class="bg-transparent">
              <q-img
                src="../assets/meinungsbroschuere.png"
                fit="scale-down"
                style="height: 300px"
                id="img-hover"
              >
              </q-img>
              <q-card-section>
                <div class="text-h6 text-center">Meinungsbroschüre</div>
                <div class="text-body1 text-center">
                  {{ $t('startingpage.meinungsbroschuere') }}
                </div>
              </q-card-section>
            </q-card>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div id="expansion-items" class="row justify-center q-pa-md q-mt-xl">
      <div class="col-12 col-md-8 text-start text-bold text-orange-8 text-h4 q-mb-md">FAQ:</div>
      <div class="col-12 col-md-8 q-mb-md">
        <!-- eslint-disable -->
        <q-expansion-item
          v-for="(item, index) in sanitizedExpansionItems"
          :key="index"
          style="border-radius: 5px"
          class="shadow-1 overflow-hidden q-mb-lg"
          v-model="expandedItems[index]"
          :label="item.title"
          header-class="bg-orange-8 text-white text-h6"
          expand-icon-class="text-white"
        >
        
          <q-card>
            <q-card-section class="text-body1">
              <div v-html="item.text"></div>
              <span v-if="index == 4">
                <router-link to="/sbwls">Link</router-link>
              </span>
              <span v-if="index == 5 || index == 7">
                <a href="src/assets/pdfs/meinungsbroschuere.pdf" target="_blank">Link</a>
              </span>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <!-- eslint-enable -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useSurveyStore } from '@/stores/survey.store'
import DOMPurify from 'dompurify'
/* eslint-disable */
export default {
  setup() {
    const q = useQuasar()
    return {
      q
    }
  },
  data() {
    return {
      surveyStore: useSurveyStore(),
      expandedItems: [false, ...Array(6).fill(false)]
    }
  },
  methods: {
    startTest() {
      this.$router.push({ name: 'question', params: { id: 1 } })
    }
  },
  computed: {
    expansionItems() {
      const items = []
      for (let i = 1; i <= 8; i++) {
        const titleKey = `faq.title_question_${i}`
        const textKey = `faq.text_question_${i}`
        const title = this.$t(titleKey)
        const text = this.$t(textKey)
        if (title && text) {
          items.push({ title, text })
        }
      }
      return items
    },
    sanitizedExpansionItems() {
      return this.expansionItems.map((item) => {
        const sanitizedText = DOMPurify.sanitize(item.text, {
          ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'ul', 'ol', 'li'],
          ALLOWED_ATTR: ['href', 'target', 'rel']
        })
        return { ...item, text: sanitizedText }
      })
    },
    badgeStyle() {
      return {
        width: !this.q.screen.lt.md ? '250px' : '150px',
      }
    },
    heading() {
      return !this.q.screen.lt.md ? 'text-h3 text-center text-bold text-white q-mb-md' : 'text-h4 text-center text-bold text-white q-mb-md'
    },
    headingMargin() {
      return !this.q.screen.lt.md ? 'col-12 row justify-center q-gutter-md q-mt-lg' : 'col-12 row justify-center q-gutter-md'
    }
  },
  mounted() {}
}
/* eslint-enable */
</script>

<style>
body {
  overflow-x: hidden;
}
#poweredBy {
  font-family: 'Gochi Hand', cursive;
}
#rainbow {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  opacity: 15%;
  max-height: 100vh;
}
.info-card {
  max-width: 350px;
}
#card-hover {
  cursor: pointer;
}
#img-hover {
  transition: transform 0.3s ease; 
}

#card-hover:hover #img-hover {
  transform: scale(1.1); 
}
@keyframes wave {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100vw);
  }
}

#wave {
  width: 200vw;
  height: 40px;
  animation: wave 16s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
  display: block;
  position: absolute;
  overflow: hidden;
  transform: translate(0, 0);
  z-index: 1;
  margin-top: -40px;
}
#akzent { 
  width: 20px;
}
#akzent-flipped {
  width: 20px;
  transform: scaleX(-1); 
}
</style>
