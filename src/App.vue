<template>
  <div id="app">
    <TaigoEmblem style="display: none" />
    <div class="content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <div class="footer">
      <Footer />
    </div>
  </div>
</template>

<script>
import TaigoEmblemVue from './components/TaigoEmblem.vue';
import Footer from './components/foot.vue';

export default {
  components: {
    TaigoEmblem: TaigoEmblemVue,
    Footer
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
html, body {
  height: 100%;
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
}


</style>
