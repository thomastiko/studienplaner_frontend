<template>
  <div>
    <div class="text-h3 text-center text-weight-medium q-mb-sm">LVs aktualisieren</div>
    <div class="row">
      <div class="col-12">
        <form @submit.prevent="startScraper">
          <div class="q-mb-md">
            <div class="q-gutter-sm">
              <input v-model="link.id" placeholder="ID" required />
              <input v-model="link.url" placeholder="URL" required />
            </div>
          </div>
          <div class="q-mb-md">
            <input v-model="semester" placeholder="Semester" required />
          </div>
          <button type="submit">Go</button>
        </form>
      </div>
    </div>

    <!-- Fortschrittsmeldungen anzeigen -->
    <div v-if="progressMessages.length > 0" class="progress-messages">
      <h4>Fortschritt:</h4>
      <ul>
        <li v-for="(message, index) in progressMessages" :key="index">{{ message }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useAdminStore } from '@/stores/admin.store'

export default {
  name: 'ScraperComponent',
  data() {
    return {
      link: { id: '', url: '' }, // Nur ein Link-Objekt
      semester: '',
      progressMessages: [],
      eventSource: null
    }
  },
  methods: {
    async startScraper() {
      // Überprüfen, ob der Link und die ID eingegeben wurden
      if (!this.link.id || !this.link.url) {
        alert('Bitte geben Sie eine ID und eine URL ein.')
        return
      }

      const payload = {
        links: [this.link], // Einzelnen Link in ein Array verpacken
        semester: this.semester
      }

      // Starte die SSE-Verbindung
      this.startEventSource()

      try {
        const adminStore = useAdminStore()
        await adminStore.startScraper(payload.links, payload.semester)
        alert('Scraping erfolgreich abgeschlossen!')
      } catch (error) {
        alert('Fehler beim Scraping: ' + (error.response?.data?.message || error.message))
      } finally {
        // Schließe die SSE-Verbindung
        this.closeEventSource()
      }
    },
    startEventSource() {
      // Initialisiere die SSE-Verbindung
      this.eventSource = new EventSource('http://localhost:5000/api/admin/scrape-progress')

      this.eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.progressMessages.push(data.message)
      }

      this.eventSource.onerror = (error) => {
        console.error('SSE-Verbindungsfehler:', error)
        this.eventSource.close()
      }
    },
    closeEventSource() {
      if (this.eventSource) {
        this.eventSource.close()
        this.eventSource = null
      }
    }
  },
  beforeDestroy() {
    // Stelle sicher, dass die SSE-Verbindung geschlossen wird
    this.closeEventSource()
  }
}
</script>

<style scoped>
/* Hier kannst du dein CSS hinzufügen */
</style>
