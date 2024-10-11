<template>
  <div>
    {{subject.name}}
  </div>

</template>

<script>
export default {
    props: {
        subject: {
            type: Object,
            required: true
        }
    },

}
</script>

<style>

</style>