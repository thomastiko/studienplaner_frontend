<template>
  <div>
    <q-layout view="lHh lpr lFf" container style="min-height: 100px">
      <q-header class="bg-blue-4">
        <q-toolbar>
          <div
            style="min-width: 60px"
            class="cursor-pointer"
            @click="() => { tab = ''; $router.push({ name: 'home', path: '/' }); }"
          >
            <img src="../assets/logo-white.svg" />
          </div>

          <q-toolbar-title
            class="cursor-pointer"
            @click="() => { tab = ''; $router.push({ name: 'home', path: '/' }); }"
            >Studienplaner
            <q-badge align="top" color="orange">BETA</q-badge>
          </q-toolbar-title>

          <q-btn-dropdown :label="this.$i18n.locale == 'de' ? 'Deutsch' : 'English'" flat>
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
          <q-btn-dropdown
            v-if="userStore.loggedIn"
            flat
            class="text-h6 text-white"
            size="md"
            icon-right="person"
            :label="userStore.user.email"
          >
            <q-item clickable v-close-popup @click="logout">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-btn-dropdown>
          <q-btn
            v-else
            flat
            class="text-h6 text-white"
            size="md"
            icon-right="login"
            label="Login"
            @click="this.$router.push({ name: 'login', path: '/login' })"
          />
        </q-toolbar>

        <q-tabs inline-label outside-arrows mobile-arrows v-model="tab">
          <q-tab
            :label="$t('myStudy.heading_1')" name="my-study"
            @click="this.$router.push({ name: 'my-study', path: '/my-study' })"
          />
          <q-tab
            label="LV-PLANER" name="lvplaner"
            @click="this.$router.push({ name: 'LvPlaner', path: '/lvplaner' })"
          />
          <q-tab
            label="PROFCHECK" name="profcheck"
            @click="this.$router.push({ name: 'Profcheck', path: '/profcheck' })"
          />
          <q-tab
            label="STUDIES" name="studies"
            @click="this.$router.push({ name: 'studies', path: '/studies' })"
          />
          <q-tab
            v-if="userStore.loggedIn && userStore.user.role === 'admin'"
            label="ADMIN PANEL" name="admin-panel"
            @click="this.$router.push({ name: 'AdminPanel', path: '/admin-panel' })"
          />
        </q-tabs>
      </q-header>
    </q-layout>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user.store.js' // Importiere den User-Store
import { useRouter } from 'vue-router' // Importiere useRouter
import { useQuasar } from 'quasar' // Importiere Quasar
import { ref } from 'vue'

export default {
  setup() {
    const userStore = useUserStore() // Hole den User-Store
    const router = useRouter()
    const q = useQuasar()
    const logout = async () => {
      await userStore.logout(router, q.notify) // Router übergeben
    }

    return {
      userStore, // Verfügbarmachen des Stores in der Komponente
      logout,
      tab: ref('')
    }
  },
  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale
      sessionStorage.setItem('selectedLocale', locale)
    }
  }
}
</script>

<style scoped>
::v-deep(.absolute-full) {
  transform: none;
}
</style>
