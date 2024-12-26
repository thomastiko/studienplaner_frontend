<template>
  <div>
    <q-btn
      color="blue-4"
      :icon-right="selectionMode ? 'arrow_forward' : 'add'"
      no-caps	
      :label="selectionMode ? '' : 'LVs hinzufügen'"
      size="md"
      class="fab-position"
      @click="handleClick"
    >
    <q-tooltip v-if="this.lvStore.cart.length === 0 && selectionMode">
      Füge Lehrveranstaltungen hinzu
    </q-tooltip>
    <q-popup-proxy v-model="openMenu" context-menu :breakpoint="100" style="max-height: unset; overflow: hidden;">
      <q-list>
        <q-item :disable="this.lvStore.cart.length === 0 && selectionMode" clickable v-close-popup @click="goToLvPlaner">
          <q-item-section>
            <div style="white-space: nowrap;">Weiter zum LV-Planer</div>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <div class="text-negative" @click="deaktivateSelectionMode">
          Abbrechen
          </div>
        </q-item>
      </q-list>
    </q-popup-proxy>
    </q-btn>
  </div>
</template>

<script>
import { useLvStore } from '@/stores/lv.store'
import { ref } from 'vue'
export default {
  setup() {
    const lvStore = useLvStore()
    const openMenu = ref(false)

    return {
      lvStore,
      openMenu
    }
  },
  props: {
    selectionMode: {
      type: Boolean
    }
  },
  methods: {
    goToLvPlaner() {
      this.$router.push({name: 'AddLv', route: 'addlv'})
    },
    handleClick() {
      if (!this.selectionMode) {
      this.$emit('activate-selection-mode')
      } else {
        this.openMenu = true
      }
    },
    deaktivateSelectionMode() {
      this.$emit('deactivate-selection-mode')
    }
  },
  mounted() {
  }
}
</script>

<style>
.fab-position {
  position: fixed;
  bottom: 16px;
  right: 20px;
}
</style>
