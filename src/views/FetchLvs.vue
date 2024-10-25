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

    <!-- Fortschrittsmeldungen anzeigen -->
    <div v-if="progressMessages.length > 0" class="progress-messages">
      <h4>Fortschritt:</h4>
      <ul>
        <li v-for="(message, index) in progressMessages" :key="index">{{ message }}</li>
      </ul>
    </div>

    <!-- Spinner anzeigen, wenn aktiv -->
    <div v-if="loading" class="text-center q-my-lg">
      <q-spinner color="primary" size="50px" />
      <div class="text-subtitle1 q-my-sm">Scraper läuft, bitte warten...</div>
    </div>
  </div>
</template>

<script>
import { useAdminStore } from '@/stores/admin.store'; // Importiere den adminStore

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
    };
  },
  methods: {
    async startScraper() {
      // Überprüfen, ob alle Links und der Dateiname eingegeben wurden
      if (this.links.some(link => !link.id || !link.url) || !this.semester) {
        alert('Bitte geben Sie alle Links, IDs und den Dateinamen ein.');
        return;
      }

      const payload = {
        links: this.links,
        semester: this.semester
      };

      // Spinner aktivieren
      this.loading = true;
      this.progressMessages = [];

      try {
        // Verwende den adminStore, um die Scraper-Funktion aufzurufen
        const adminStore = useAdminStore();
        await adminStore.runScraper(payload.links, payload.semester);
        alert('Scraping erfolgreich abgeschlossen!');
      } catch (error) {
        alert('Fehler beim Scraping: ' + (error.response?.data?.message || error.message));
      } finally {
        // Spinner deaktivieren
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Füge hier dein CSS hinzu */
</style>
