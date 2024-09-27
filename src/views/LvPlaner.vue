<template>
  <div>
    <div class="title q-mb-lg">
      <h1>LV-Planer</h1>
      <p class="paragraph-1 q-mt-md">Your course scheduling tool</p>
    </div>
    <div class="bg" ></div>
    <!-- Select Add LV or Calendar Management-->
    <div class="col-12 row justify-center q-mb-xl">
        <q-btn text-color="blue-4" color="white" :label="$t('lvplaner.add_lv_button')" @click="this.$router.push('/addlv')" />
    </div>
    <div class="col-12 row justify-center">
      <div class="col-12 q-mt-xl">
    <Calendar />
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from '../components/lvplaner/calendar.vue'
export default {
  data() {
    return {

    }
  },
  components: {
      Calendar
  },
  methods: {
  },


}
</script>

<style scoped>

</style>