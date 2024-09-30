<template>
  <div>
    {{ this.userStore.user.studies }}
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user.store';
export default {
  props: ['study_id'],
  setup(props) {
    let studyId = props.study_id || window.location.pathname.split("/")[2];

    if (!studyId) {
      throw new Error("No study id provided");
    }

    
    const userStore = useUserStore();
    console.log(props.study_id);
    return {
        userStore,
    };
  },

}
</script>

<style>

</style>