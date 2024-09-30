<template>
  <div class="row bg-orange-8 justify-center text-center text-body2 text-white">
    <div class="col-12" style="height: 30px; background-color: #fecea3"></div>
    <div class="col-12" style="height: 30px; background-color: #fd9b46"></div>
    <div class="row col-12 col-md-8 items-center q-ma-md q-col-gutter-md" style="min-height: 150px">
      <div class="col-12 col-md-3 text-bold" @click="showEasterEggAndHide">
        © {{ currentYear }} AG WU
      </div>
      <div class="col-12 col-md-3">
        <div class="col-12">
          <span>
            <q-icon name="fa-regular fa-envelope" />
          </span>
          info@ag-wu.at
        </div>
        <div class="col-12">
          <span>
            <q-icon name="fa-brands fa-instagram" />
          </span>
          <a
            href="https://www.instagram.com/aktionsgemeinschaft_wu/"
            target="_blank"
            style="text-decoration: none; color: white"
          >
            aktionsgemeinschaft_wu
          </a>
        </div>
      </div>
      <!-- EASTEREGG -->
      <div v-if="showEasterEgg" class="easteregg">
        <q-img src="@/assets/pixel-lisa.svg" alt="Easteregg Image" height="150px" width="150px" />
        <p>
          Hi, ich bin Lisa! <br />
          Schön, dass du hier bist
        </p>
      </div>
      <div class="col-12 col-md-3">
        <span><q-icon name="fa-solid fa-location-dot" /></span>
        AktionsGemeinschaft WU <br />
        Welthandelsplatz 1 1020 Wien
      </div>
      <div class="row col-12 col-md-3 text-bold text-uppercase">
        <div class="col-12">
          <a
            href="https://ag-wu.at/datenschutz/"
            target="_blank"
            style="text-decoration: none; color: white"
            >Datenschutz</a
          >
        </div>
        <div class="col-12">
          <a
            href="https://ag-wu.at/impressum/"
            target="_blank"
            style="text-decoration: none; color: white"
            >Impressum</a
          >
        </div>
        <div class="col-12">
          <a
            :href="pdfUrl"
            style="text-decoration: none; color: white"
            >Methodik</a
          >
        </div>
      </div>
    </div>
    <div class="col-12 text-caption">Concept and development by Georg Haunschmidt and Thomas Tikovits</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
      showEasterEgg: false,
      pdfUrl: 'src/assets/pdfs/methodik.pdf',
    }
  },
  methods: {
    showEasterEggAndHide() {
      this.showEasterEgg = true
      setTimeout(() => {
        this.showEasterEgg = false
      }, 4000) // Versteckt das Easteregg nach 3 Sekunden
    }
  }
}
</script>

<style>
.easteregg {
  position: fixed;
  display: flex;
  align-items: center;
  animation: mymove 2s forwards;
  left: 50%;
  transform: translateX(-50%);
}

.easteregg img {
  width: 100px;
}

.easteregg p {
  font-weight: 800;
  color: black;
  opacity: 0;
  animation: fadeIn 2s forwards;
  animation-delay: 2s;
  margin-left: 10px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 100;
  }
}

@keyframes mymove {
  from {
    bottom: 0;
  }

  to {
    bottom: 20%;
  }
}
</style>
