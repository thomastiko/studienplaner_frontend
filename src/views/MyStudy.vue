<template>
  <div>
    <div class="text-h1 text-center text-weight-medium text-uppercase q-mb-sm">
      Mein Studium
    </div>
    <div class="column items-center">
      <div class="col" v-for="(study, i) in this.userStore.user.studies" :key="i" >
        <q-card class="my-card cursor-pointer" v-ripple @click="openStudy(study.study_id)">
      <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
        <div class="absolute-bottom">
          <div class="text-h4 text-white"> {{study.study_name_short}} </div>
          <div class="text-subtitle1">{{study.study_name}}</div>
        </div>
      </q-img>
    </q-card>
      </div>
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
  methods: {
    openStudy(study_id) {
      this.$router.push({ name: 'Studyplan', params: { study_id } });
    },
  },
  computed: {},
  mounted() {
    this.userStore.fetchUser();
    console.log(this.userStore.user);
  },
};
</script>

<style scoped>
.my-card {
  min-width: 350px;
  max-width: 400px;
  width: 100%;
  transition: all 0.3s;
}

.my-card:hover {
  filter: brightness(1.1);
}
</style>
