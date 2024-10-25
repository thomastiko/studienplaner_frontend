<template>
  <div>
    <div class="text-h1 text-center text-weight-medium text-uppercase q-mb-sm">Admin-Panel</div>
    <div class="row q-ma-md">
      <div class="col-12 column justify-center">
        <q-btn
          label="Profcheck verwalten"
          no-caps
          flat
          icon-right="arrow_right"
          @click="
            this.$router.push({ name: 'ManageCommentary', path: '/admin-panel/manage-commentary' })
          "
        />
        <q-btn label="LVs aktualisieren" no-caps flat icon-right="arrow_right" @click="
            this.$router.push({ name: 'FetchLvs', path: '/admin-panel/fetch-lvs' })
          " />
      </div>
    </div>
    <div class="row q-ma-md">
      <div class="col-12">
        <q-table
          id="userTable"
          wrap-cells
          style="height: 600px"
          title="Users"
          :title-class="'text-h5'"
          :rows="rows"
          :columns="columns_user"
          row-key="_id"
          :filter="filter"
        >
        </q-table>
      </div>
      <div class="col-12">
        <q-table
          id="studiesTable"
          wrap-cells
          style="height: 600px"
          title="Lehrveranstaltungen"
          :title-class="'text-h5'"
          :rows="courseRows"
          :columns="columns_study"
          row-key="name"
          :filter="filter"
        >
        </q-table>
      </div>
    </div>
  </div>
</template>

<script>
import { useAdminStore } from '@/stores/admin.store.js'
import { ref } from 'vue'

export default {
  setup() {
    const adminStore = useAdminStore()

    return {
      adminStore,
      rows: ref([]),
      courseRows: ref([]),
      filter: ref(''),
      columns_user: [
        {
          name: 'email',
          label: 'E-Mail',
          field: (row) => row.email || '-',
          align: 'left',
          sortable: true
        },
        {
          name: 'role',
          label: 'Rolle',
          field: (row) => row.role || '-',
          align: 'left',
          sortable: true
        }
      ],
      columns_study: [
        {
          name: 'name',
          label: 'Lehrveranstaltung',
          field: (row) => row.name,
          align: 'left',
          sortable: true
        },
        {
          name: 'semester',
          label: 'Semester',
          field: (row) => row.semester,
          align: 'left',
          sortable: true
        },
        {
          name: 'count',
          label: 'Anzahl',
          field: (row) => row.count,
          align: 'left',
          sortable: true
        }
      ]
    }
  },
  async mounted() {
    // Benutzer abrufen
    const response = await this.adminStore.fetchUsers()
    this.rows.length = 0
    this.rows.push(...response.data)

    // Lehrveranstaltungsdaten aggregieren
    const courseCountMap = {}

    // Iteriere durch alle Benutzer und deren Kursdaten
    response.data.forEach(user => {
      user.course_entries.forEach(course => {
        const key = `${course.name}_${course.semester}` // Verwende Name und Semester als eindeutigen Schlüssel

        if (!courseCountMap[key]) {
          courseCountMap[key] = {
            name: course.name,
            semester: course.semester,
            count: 1
          }
        } else {
          courseCountMap[key].count += 1
        }
      })
    })

    // Aggregierte Lehrveranstaltungen in courseRows speichern
    this.courseRows.length = 0
    this.courseRows.push(...Object.values(courseCountMap))
  }
}
</script>

<style></style>
