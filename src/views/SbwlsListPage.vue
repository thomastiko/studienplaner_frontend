<template>
  <div class="q-pa-md">
    <q-btn class="q-mb-md" @click="goBack" flat text-color="deep-orange" icon="arrow_back" />
    <q-table
      title="Spezialiserung"
      grid
      :columns="columns"
      :rows="populatedRows"
      :pagination="pagination"
      separator="cell"
      row-key="name"
      @row-click="onRowClick"
      :visible-columns="selectedColumns"
    >
      <template v-slot:top>
        <div class="row items-end">
        <div class="col-12 col-md-8 row q-mb-md q-col-gutter-sm">
          <div class="col-12">
            <div class="text-h6">{{ $t('sbwllistpage.all_spezializations') }}</div>
          </div>
          <div class="col-12 row items-center">
            <q-icon name="thumb_up" color="green" size="sm" class="q-pr-sm" />
            <div class="text-body2">= {{ $t('sbwllistpage.green_thumb_up') }}</div>
          </div>
          <div class="col-12 row items-center">
            <q-icon name="thumb_up" color="blue" size="sm" class="q-pr-sm" />
            <div class="text-body2">= {{ $t('sbwllistpage.blue_thumb_up') }}</div>
          </div>
          <div class="col-12 row items-center">
            <q-icon name="thumb_up" color="orange" size="sm" class="q-pr-sm" />
            <div class="text-body2">= {{ $t('sbwllistpage.orange_thumb_up') }}</div>
          </div>
          <div class="col-12 row items-center">
            <q-icon name="close" size="sm" class="q-pr-sm" />
            <div class="text-body2">= {{ $t('sbwllistpage.close') }}</div>
          </div>
        </div>
        <div :class="tableHeader">
        <q-btn
          :label="$t('sbwllistpage.show_all')"
          @click="
            this.selectedColumns = [
              'bw19',
              'bw23',
              'test19',
              'test23',
              'winf19',
              'winf23',
              'vw23',
              'wire16',
              'wire23',
              'bbe'
            ]
          "
        />

        <q-select
          v-model="selectedColumns"
          filled
          :display-value="$t('sbwllistpage.select_study')"
          emit-value
          map-options
          :options="columnOptions"
          option-value="name"
          option-label="label"
          style="min-width: 150px"
        />
        </div>
        </div>
      </template>
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-4">
          <q-card
            v-for="col in props.cols.slice(0, 1)"
            :key="col.name"
            bordered
            flat
            @click="onRowClick(col.value)"
            style="min-height: 130px"
          >
            <q-list dense>
              <q-item clickable v-ripple>
                <q-item-section class="q-pa-md">
                  <div>
                    <q-item-label class="text-caption">{{ col.label }}</q-item-label>
                    <q-item-label class="text-h6">{{ col.value || '-' }}</q-item-label>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
          <q-card>
            <q-list class="row q-pa-sm">
              <q-item-section
                class="col text-center"
                v-for="col in props.cols.slice(1)"
                :key="col.name"
              >
                <q-item-section>
                  <q-item-label class="text-caption">{{ col.label }}</q-item-label>
                  <q-item-label class="text-body1" v-if="!col.value">
                    <q-icon name="close">
                      <q-tooltip> {{$t('sbwllistpage.close')}} </q-tooltip>
                    </q-icon>
                  </q-item-label>
                  <q-item-label class="text-body1" v-else-if="col.value === 'Spezialisierung'">
                    <q-icon name="thumb_up" color="green">
                      <q-tooltip> {{$t('sbwllistpage.green_thumb_up')}} </q-tooltip>
                    </q-icon>
                  </q-item-label>
                  <q-item-label
                    class="text-body1"
                    v-else-if="col.value === 'Komplementärfach' || col.value === 'Kein BW-Bezug'"
                  >
                    <q-icon name="thumb_up" color="orange">
                      <q-tooltip> {{$t('sbwllistpage.orange_thumb_up')}} </q-tooltip>
                    </q-icon>
                  </q-item-label>
                  <q-item-label class="text-body1" v-else-if="col.value === 'IT-Spezialisierung'">
                    <q-icon name="thumb_up" color="green">
                      <q-tooltip> {{$t('sbwllistpage.green_thumb_up')}} </q-tooltip>
                    </q-icon>
                  </q-item-label>
                  <q-item-label class="text-body1" v-else-if="col.value === 'Nicht-IT-Spez.'">
                    <q-icon name="thumb_up" color="blue">
                      <q-tooltip> {{$t('sbwllistpage.blue_thumb_up')}} </q-tooltip>
                    </q-icon>
                  </q-item-label>
                  <q-item-label class="text-body1" v-else>
                    {{ col.value }}
                  </q-item-label>
                </q-item-section>
              </q-item-section>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import sbwls from '@/stores/sbwls.json'

export default {
  setup() {
    const processedRows = sbwls.map((sbwl) => {
      return {
        ...sbwl,
        ...sbwl.study
      }
    })
    const rows = ref(processedRows)
    const columns = [
      {
        name: 'name',
        required: true,
        label: 'Name',
        align: 'left',
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true
      },
      { name: 'bw19', label: 'BW-19', align: 'center', field: 'bw19', sortable: true },
      { name: 'bw23', label: 'BW-23', align: 'center', field: 'bw23', sortable: true },
      { name: 'test19', label: 'IBW-19', align: 'center', field: 'test19', sortable: true },
      { name: 'test23', label: 'IBW-23', align: 'center', field: 'test23', sortable: true },
      { name: 'winf19', label: 'WINF-19', align: 'center', field: 'winf19', sortable: true },
      { name: 'winf23', label: 'WINF-23', align: 'center', field: 'winf23', sortable: true },
      { name: 'vw23', label: 'VW-23', align: 'center', field: 'vw23', sortable: true },
      { name: 'wire16', label: 'WIRE-16', align: 'center', field: 'wire16', sortable: true },
      { name: 'wire23', label: 'WIRE-23', align: 'center', field: 'wire23', sortable: true },
      { name: 'bbe', label: 'BBE', align: 'center', field: 'bbe', sortable: true }
    ]
    const populatedRows = computed(() => {
      return rows.value.map((row) => {
        const newRow = { ...row }
        columns.forEach((column) => {
          if (!newRow[column.name]) {
            newRow[column.name] = null
          }
        })
        return newRow
      })
    })

    const selectedColumns = ref([
      'bw19',
      'bw23',
      'test19',
      'test23',
      'winf19',
      'winf23',
      'vw23',
      'wire16',
      'wire23',
      'bbe'
    ])

    const columnOptions = computed(() => columns.filter((col, index) => index !== 0))

    return {
      columns,
      populatedRows,
      selectedColumns,
      columnOptions,
      pagination: {
        page: 1,
        rowsPerPage: 0
      },
      close: ref(false)
    }
  },
  methods: {
    onRowClick(sbwlName) {
      console.log(sbwlName)
      this.$router.push({ name: 'SBWLDetail', params: { name: sbwlName } })
    },
    goBack() {
      this.$router.go(-1)
    }
  },
  computed: {
    tableHeader() {
      if (!this.$q.screen.lt.md) {
        return 'row col-12 col-md-4 q-gutter-md justify-end'
      }
      else {
        return 'row col-12 col-md-4 q-gutter-md'
      }
    }
  
  }
}
</script>

<style lang="sass"></style>
