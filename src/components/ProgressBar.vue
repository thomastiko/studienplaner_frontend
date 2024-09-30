<template>
  <div>
    <div class="q-ma-md">
    <q-linear-progress size="25px" color="deep-orange" :value="progress">
      <div class="absolute-full flex flex-center">
        <q-badge color="white" text-color="deep-orange" :label="progressLabel"  />
      </div>
    </q-linear-progress>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    questions: {
      type: Array,
      required: true
    },
    currentQuestionIndex: {
      type: Number,
      required: true
    }
  },
  computed: {
    progress() {
        return (this.currentQuestionIndex ) / this.questions.length
    },
    progressLabel() {
      if (this.currentQuestionIndex === this.questions.length) {
        return `${this.questions.length} Fragen von ${this.questions.length}`;
      } else {
        return `${this.currentQuestionIndex + 1} Frage von ${this.questions.length}`;
      }
    }
  },
  mounted() {
  }
}
</script>

<style></style>
