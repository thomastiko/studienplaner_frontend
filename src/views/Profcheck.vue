<template>
  <div>
    <div class="text-h1 text-center text-weight-medium text-uppercase q-mb-sm q-mt-md">Prof&shy;check</div>
    <div class="text-h5 text-center text-weight-medium q-mb-lg">
      {{ $t('profcheck.subtitle_1') }}
    </div>

    <!-- Spinner anzeigen, wenn Daten noch laden -->
    <div v-if="loading" class="row justify-center">
    <q-spinner size="50px"  color="primary" class="q-my-lg" />
    </div>

    <!-- Tabelle anzeigen, wenn Daten geladen sind -->
    <div v-else class="q-ma-md">
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
        :filter="filter"
        :rows-per-page-options="[0]"
        @row-click="onRowClick"
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import { useProfStore } from '@/stores/prof.store'
import { ref } from 'vue'
import router from "../router";

export default {
  setup() {
    const profStore = useProfStore()
    return {
      profStore: ref(profStore),
      rows: ref([]),
      filter: ref(''),
      loading: ref(true), // Spinner-Status hinzufügen
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
          name: 'ratingCount',
          label: `${ this.$t('profcheck.rating_count') }`,
          field: (row) => row.factors[0]?.ratings || '-',
          align: 'center',
          sortable: true
        },
        {
          name: 'ratingSummary',
          label: `${ this.$t('profcheck.rating_summary') }`,	
          field: (row) => (row.factors[0]?.gesamt ? row.factors[0].gesamt.toFixed(2) : '-'),
          align: 'center',
          sortable: true
        }
      ]
    }
  },
  methods: {
    async onRowClick(evt, row) {
      await this.profStore.findProf(row._id);
      router.push({ name: 'ProfessorPage', params: { prof_id: row._id } });
    }
  },
  async mounted() {
    try {
      const response = await this.profStore.fetchProfs()
      this.rows.length = 0
      this.rows.push(...response.data)
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false // Spinner ausschalten, wenn Laden abgeschlossen ist
    }
  }
}
</script>

<style></style>
