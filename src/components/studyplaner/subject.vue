<template>
<q-card class="my-card">
      <q-card-section :style="{backgroundColor: getSubjectColor()}">
        <div class="text-h6 text-grey-9"> {{subject.name}} </div>
        <div class="text-subtitle2"> {{subject.category}} </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat>Action 1</q-btn>
        <q-btn flat>Action 2</q-btn>
      </q-card-actions>
    </q-card>
</template>

<script>
export default {
  props: {
    subject: {
      type: Object,
      required: true
    }
  },
  methods: {
    getSubjectColor() {
      let color = this.subject.color
      if (this.subject.status == "unavailable") {
        color = "#D9D9D9"
      } else if (this.subject.status == "done") {
        color = "#98F280"
      } else if (this.subject.status == "doing") {
        color = "#FFA03D"
      } else {
        color = this.subject.color
      }
      return color || "#FFFFFF";
    }
  },
  mounted() {
  }
}
</script>

<style>

</style>