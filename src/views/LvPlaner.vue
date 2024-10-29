<template>
  <div>
    <div class="text-h1 text-center text-weight-medium text-uppercase q-mb-sm q-mt-md">LV-Planer</div>
    <div class="text-h5 text-center text-weight-medium q-mb-lg">
        {{ $t('lvPlaner.subtitle_1') }}
      </div>
    <div class="bg"></div>
    <!-- Select Add LV or Calendar Management-->
    <div class="col-12 row justify-center q-mb-xl">
      <q-btn
        text-color="blue-4"
        color="white"
        :label="$t('lvPlaner.add_lv')"
        @click="this.$router.push({ name: 'AddLv', path: '/addlv' })"
      />
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
import { useUserStore } from '@/stores/user.store'

export default {
  setup() {
    const userStore = useUserStore();

    return {
      userStore,
    }
  },
  components: {
    Calendar
  },
  mounted() {
    this.userStore.fetchUser();
  }
}
</script>

<style scoped></style>
