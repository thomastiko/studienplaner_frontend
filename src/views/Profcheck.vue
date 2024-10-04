<template>
  <div>
    <div class="text-h1 text-center text-weight-medium text-uppercase q-mb-sm">Prof&shy;check</div>
    <q-table
      id="profTable"
      wrap-cells
      style="height: 600px"
      title="Professors"
      :title-class="'text-h5'"
      :rows="rows"
      :columns="columns"
      row-key="_id"
      virtual-scroll
      :rows-per-page-options="[0]"
      @row-click="onRowClick"
    />
  </div>
</template>

<script>
import { useProfStore } from '@/stores/prof.store'
import { ref } from 'vue'
export default {
  setup() {
    const profStore = useProfStore()
    return {
      profStore: ref(profStore),
      rows: ref([]),
      columns: [
        {
          name: 'name',
          label: 'Name',
          field: (row) => `${row.title ?? ''} ${row.fname} ${row.lname}`,
          align: 'left',
          sortable: true
        },
        {
          name: 'institute',
          label: 'Institute',
          field: 'institute',
          align: 'left',
          sortable: true
        },
        {
          name: 'ratingSummary',
          label: 'Rating Summary',
          field: (row) => row.factors[0]?.gesamt || '-',
          align: 'center',
          sortable: true
        },
        {
          name: 'ratingCount',
          label: 'Rating Count',
          field: (row) => row.factors[0]?.ratings || '-',
          align: 'center',
          sortable: true
        }
      ]
    }
  },
  async mounted() {
    try {
      const response = await this.profStore.fetchProfs()
      console.log(response)
      this.rows.length = 0
      this.rows.push(...response.data)
    } catch (error) {
      console.error(error)
    }
  }
}
</script>

<style></style>
