<template>
  <div>
    <div class="text-h3 text-center text-weight-medium q-mb-sm">LVs aktualisieren</div>
    <div class="row">
      <div class="col-12">
        <form @submit.prevent="startScraper">
          <div class="q-mb-md">
            <div class="q-gutter-sm">
              <div v-for="(link, index) in links" :key="index" class="q-mb-md">
                <input v-model="link.id" :placeholder="'ID Link ' + (index + 1)" required />
                <input v-model="link.url" :placeholder="'URL Link ' + (index + 1)" required />
              </div>
            </div>
          </div>
          <div class="q-mb-md">
            <input v-model="semester" placeholder="Format: WS2024 SS2025" required />
          </div>
          <button type="submit">Go</button>
        </form>
      </div>
    </div>
    <!-- Spinner anzeigen, wenn aktiv -->
    <div v-if="loading" class="text-center q-my-lg">
      <q-spinner color="primary" size="50px" />
      <div class="text-subtitle1 q-my-sm">{{ spinnerMessage }}</div>
    </div>

    <!-- Fortschrittsmeldungen anzeigen -->
    <div v-if="progressMessages.length > 0" class="progress-messages">
      <h4>Fortschritt:</h4>
      <ul>
        <li v-for="(message, index) in progressMessages" :key="index">
          {{ message }}
        </li>
      </ul>
    </div>
    <button @click="setNewCollection">
      Neue Collection erstellen und verwenden
    </button>
  </div>
</template>

<script>
import { useAdminStore } from '@/stores/admin.store'
import { useLvStore } from '@/stores/lv.store'

export default {
  name: 'ScraperComponent',
  data() {
    return {
      links: [
        { id: '', url: '' },
        { id: '', url: '' },
        { id: '', url: '' }
      ],
      semester: '', // Semester
      loading: false, // Status für den Spinner
      progressMessages: [], // Fortschrittsmeldungen
      scrapingComplete: false,
      spinnerMessage:
        'Scraper läuft! Dies kann bis zu 2 Stunden dauern. Bitte stell sicher, dass die Internetverbindung durchgehend hergestellt ist.' // Nachricht beim Laufen des Spinners
    }
  },
  methods: {
    setupWebSocket() {
      this.socket = new WebSocket('ws://localhost:5000') // WebSocket-Verbindung zum Backend

      this.socket.onopen = () => {
        console.log('WebSocket-Verbindung geöffnet')
      }

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)

        // Nachrichtentypen verarbeiten
        if (data.type === 'link' || data.type === 'status') {
          this.progressMessages.push(data.message)

          if (data.type === 'complete') {
            this.loading = false
            this.scrapingComplete = true
            this.spinnerMessage = 'Scraping abgeschlossen!'
            this.progressMessages.push('Scraping abgeschlossen.')
          }
        }
      }

      this.socket.onclose = () => {
        console.log('WebSocket-Verbindung geschlossen')
      }
    },
    async startScraper() {
      if (this.links.some((link) => !link.id || !link.url) || !this.semester) {
        alert('Bitte geben Sie alle Links, IDs und das Semester ein.')
        return
      }

      const payload = { links: this.links, semester: this.semester }
      console.log('Payload:', payload)
      this.loading = true
      this.scrapingComplete = false
      this.progressMessages = []

      this.setupWebSocket()

      try {
        const adminStore = useAdminStore()
        await adminStore.runScraper(payload.links, payload.semester)
      } catch (error) {
        alert('Fehler beim Scraping: ' + (error.response?.data?.message || error.message))
        this.spinnerMessage = 'Fehler beim Scraping!'
        this.loading = false
      }
    },
    async setNewCollection() {
      const adminStore = useAdminStore();
      const lvStore = useLvStore();
      try {
        const collectionName = `courses_${this.semester}`;
        console.log(collectionName) // Formatierung des Collection-Namens
        await adminStore.createAndSetNewCollection(collectionName); // Übergibt den Namen ans Backend
        alert('Neue Collection erstellt und als aktuelle Collection gesetzt!');
        await lvStore.fetchCourses(); // Abruf der Kurse von der neuen Collection
      } catch (error) {
        console.error('Fehler beim Setzen der neuen Collection:', error);
      }
    }
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.close()
    }
  }
}
</script>

<style scoped>
.progress-messages {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
