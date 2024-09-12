<template>
  <div class="q-pa-sm bg-orange-8">
    <q-toolbar>
      <q-avatar
        square
        size="60px"
        @click="this.$router.push({ name: 'home' })"
        style="cursor: pointer"
      >
        <q-img src="../assets/agwu-logo-white.svg" />
      </q-avatar>
      <q-toolbar-title></q-toolbar-title>
      <q-btn stretch flat :label="$t('sbwllistpage.all_spezializations')" text-color="white" @click="this.$router.push({ name: 'SBWLs' })" />
      <q-separator vertical inset color="white" />
          <q-btn-dropdown flat :label="this.$i18n.locale" class="button" size="md" padding="sm" text-color="white">
            <q-list>
              <q-item clickable v-close-popup @click="changeLocale('en')">
                <q-item-section>
                  <q-item-label>English</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="changeLocale('de')">
                <q-item-section>
                  <q-item-label>Deutsch</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
    </q-toolbar>
  </div>
</template>

<script>
export default {
  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale;
      sessionStorage.setItem('selectedLocale', locale);
    },
  }
}
</script>

<style></style>
