<template>
  <div>
    <q-btn
      @click="setSeamless()"
      @dragenter="setSeamless()"
      color="positive"
      icon="add"
      round
      size="lg"
      class="fab-position"
    >
    <q-tooltip>
      Ziehe deine LVs hier rein 
    </q-tooltip>
    </q-btn>

    <q-dialog position="bottom" v-model="internalSeamless" seamless>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">LV-Cart</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-list dense>
            <q-item v-for="(cartItem, i) in this.lvStore.cart" :key="i">
              - {{ cartItem.name }}
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section class="text-center">
          <q-btn label="Weiter zum LV-Planer" flat icon-right="arrow_right" @click="goToLvPlaner" />
        </q-card-section>
        <q-card-section>
          <div class="dragzone text-center q-pa-md" @dragover.prevent @drop="handleDrop($event)">
            <q-icon name="cloud_upload" size="50px" />
            <div>Zieh deine LVs hier rein</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { useLvStore } from '@/stores/lv.store'
export default {
  setup() {
    const lvStore = useLvStore()

    return {
      lvStore
    }
  },
  emits: ['drop', 'update:seamless'],
  props: {
    seamless: {
      type: Boolean
    }
  },
  data() {
    return {
      internalSeamless: this.seamless
    }
  },
  methods: {
    setSeamless() {
      this.internalSeamless = true
    },
    handleDrop(evt) {
      this.$emit('drop', evt)
    },
    goToLvPlaner() {
      this.$router.push({name: 'AddLv', route: 'addlv'})
    }
  },
  watch: {
    seamless(newValue) {
      // Aktualisiere die lokale Datenvariable, wenn sich die Prop ändert
      this.internalSeamless = newValue
    },
    internalSeamless(newValue) {
      // Löse das Ereignis aus, wenn sich die lokale Datenvariable ändert
      this.$emit('update:seamless', newValue)
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
