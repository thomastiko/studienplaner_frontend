<template>
  <div id="app">
    <TaigoEmblem style="display: none" />
    <div>
      <Navbar />
    </div>
    <div class="content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <footer class="q-mt-xl">
      <Footer />
    </footer>
  </div>
</template>

<script>
import TaigoEmblemVue from './components/TaigoEmblem.vue';
import Footer from './components/footer.vue'
import Navbar from './components/navbar.vue'

export default {
  components: {
    TaigoEmblem: TaigoEmblemVue,
    Footer,
    Navbar
  },
  computed: {

  },
  mounted () {
    // Set the locale from the session storage
    const selectedLocale = sessionStorage.getItem('selectedLocale');
    if (selectedLocale) {
      this.$i18n.locale = selectedLocale;
    } else {
      this.$i18n.locale = this.$i18n.fallbackLocale;
    }
  }
}
</script>

<style>
html,
body {
  min-height: 100%;
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

.content {
  flex: 1;
}
</style>
