<template>
  <div class="row bg-blue-4 justify-center text-center text-body2 text-white">
    <div class="row col-12 col-md-8 items-center q-ma-md q-col-gutter-md" style="min-height: 150px">
      <div class="col-12 col-md-3 text-bold">
        © {{ currentYear }} ÖH WU
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
    }
  },
  methods: {
  }
}
</script>

<style>

</style>
