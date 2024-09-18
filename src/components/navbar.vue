<template>
  <div>
    <q-layout view="lHh lpr lFf" container style="min-height: 100px">
      <q-header class="bg-blue-4">
        <q-toolbar>
          <q-avatar>
            <img src ="../assets/oeh_logo.svg">
          </q-avatar>

          <q-toolbar-title>ÖH WU</q-toolbar-title>
            <q-btn flat class="text-h6 text-white" size="md" icon-right="login" label="Login" />
        </q-toolbar>

        <q-tabs v-model="tab">
          <q-tab name="images" label="MY STUDY" />
          <q-tab name="videos" label="LV-PLANER" />
          <q-tab name="articles" label="PROFCHECK" />
        </q-tabs>
      </q-header>
    </q-layout>
  </div>
</template>

<script>
export default {
  components: {
  },
  setup() {
  },
  computed: {
  },
  methods: {
  },
};
</script>

<style scoped>

</style>