<template>
  <div>
    <div class="text-h1 text-center text-weight-medium text-uppercase q-mb-sm">
      Mein Studium
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user.store';
export default {
  components: {},
  setup() {
    const userStore = useUserStore();
    return {
        userStore,
    };
  },
  /* async created() {
    if (!this.userStore.loggedIn) {
      this.$router.push("/");
    }
  },*/
  methods: {},
  computed: {},
};
</script>

<style scoped></style>
