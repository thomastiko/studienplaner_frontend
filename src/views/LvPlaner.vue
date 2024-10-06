<template>
  <div>
    <div class="text-h1 text-center text-weight-medium text-uppercase q-mb-sm">LV-Planer</div>
    <div class="bg"></div>
    <!-- Select Add LV or Calendar Management-->
    <div class="col-12 row justify-center q-mb-xl">
      <q-btn
        text-color="blue-4"
        color="white"
        :label="$t('lvplaner.add_lv_button')"
        @click="this.$router.push({ name: 'AddLv', path: '/addlv' })"
      />
    </div>
    <div v-for="course in userStore.user.course_entries" :key="course.course_code + '-' + course.semester">
      {{ course.subject_name }}
      <q-btn
        text-color="red-5"
        color="white"
        label="Löschen"
        @click="deleteCourse(course.course_code, course.semester)"
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

    const deleteCourse = async (courseCode, semester) => {
      try {
        await userStore.deleteCourse(courseCode, semester);
        // Optional: Benutzer über den Erfolg informieren oder die Benutzeroberfläche aktualisieren
      } catch (error) {
        console.error('Fehler beim Löschen des Kurses:', error);
        // Optional: Fehlerbehandlung, z.B. Benachrichtigung anzeigen
      }
    };

    return {
      userStore,
      deleteCourse
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
