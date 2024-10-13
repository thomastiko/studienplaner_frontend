<template>
  <div>
    <q-btn
      @click="showCart = true"
      color="purple"
      icon="add"
      round
      size="lg"
      class="fab-position"
    ></q-btn>

    <q-dialog position="bottom" v-model="showCart" seamless>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">LV-Cart</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          Hier werden die ausgweählten Lehrveranstaltungen angezeigt.
        </q-card-section>
        <q-card-section class="text-center">
            <q-btn label="Weiter zum LV-Planer" flat icon-right="arrow_right" />
        </q-card-section>
        <q-card-section>
          <div class="dragzone text-center q-pa-md">
            <q-icon name="cloud_upload" size="50px" />
            <div>Drag and drop your files here</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    const showCart = ref(false)
    return {
      showCart
    }
  }
}
</script>

<style>
.fab-position {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
}
.dragzone {
  border: dashed lightgrey;
  min-height: 200px;
  transition: all 200ms;
}
</style>
