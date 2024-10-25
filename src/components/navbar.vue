<template>
  <div>
    <q-layout view="lHh lpr lFf" container style="min-height: 100px">
      <q-header class="bg-blue-4">
        <q-toolbar>
          <div style="min-width: 60px;" class="cursor-pointer" @click="this.$router.push({ name: 'home', path: '/' })">
            <img src="../assets/logo-white.svg" />
          </div>

          <q-toolbar-title
            class="cursor-pointer"
            @click="this.$router.push({ name: 'home', path: '/' })"
            >Studienplaner
            <q-badge align="top" color="orange">BETA</q-badge>
          </q-toolbar-title>

          <!-- Überprüfe, ob der Benutzer eingeloggt ist -->
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

        <q-tabs>
          <q-tab
            label="MY STUDY"
            @click="this.$router.push({ name: 'my-study', path: '/my-study' })"
          />
          <q-tab
            label="LV-PLANER"
            @click="this.$router.push({ name: 'LvPlaner', path: '/lvplaner' })"
          />
          <q-tab
            label="PROFCHECK"
            @click="this.$router.push({ name: 'Profcheck', path: '/profcheck' })"
          />
          <q-tab
            label="STUDIES"
            @click="this.$router.push({ name: 'studies', path: '/studies' })"
          />
          <q-tab
            v-if="userStore.loggedIn && userStore.user.role === 'admin'"
            label="ADMIN PANEL"
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

export default {
  setup() {
    const userStore = useUserStore() // Hole den User-Store
    const router = useRouter()
    const logout = async () => {
      await userStore.logout(router) // Router übergeben
    }

    return {
      userStore, // Verfügbarmachen des Stores in der Komponente
      logout
    }
  }
}
</script>

<style scoped></style>
