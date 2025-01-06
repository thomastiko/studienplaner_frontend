import { defineStore } from 'pinia'
import { adminAxios, profAxios } from './config'
import { Notify } from 'quasar'

/**
 * Change the URL APIs in the config.js file
 */


export const useAdminStore = defineStore('admin', {
  state: () => ({
    comments: [],
    users: []
  }),

  actions: {
    getToken() {
      const token = localStorage.getItem('token')
      if (!token) {
        return null
      }
      return token
    },
    async fetchAllComments() {
      try {
        // Abrufen aller Kommentare vom Backend
        const response = await profAxios.get(`/comments/all`)
        this.comments = response.data
      } catch (error) {
        console.error(
          'Fehler beim Abrufen der Kommentare: ',
          error.response?.data?.message || error.message
        )
        throw error
      }
    },
    async deleteCommentSuggestion(commentId) {
      try {
        await profAxios.delete(`/comments/${commentId}`)
        this.comments = this.comments.filter((comment) => comment._id !== commentId) // Kommentar aus dem State entfernen
      } catch (error) {
        console.error(
          'Fehler beim Löschen des Kommentars:',
          error.response?.data?.message || error.message
        )
        throw error
      }
    },
    async approveComment(profId, commentId, commentValue, commentText) {
      try {
        // Sende den Kommentartext als Teil des Anfrage-Bodys
        await profAxios.post(`/comments/${profId}/release/${commentId}`, {
          commentValue: commentValue,
          commentText: commentText
        })
        // Kommentar aus der lokalen Liste entfernen
        this.comments = this.comments.filter((comment) => comment._id !== commentId)
      } catch (error) {
        console.error(
          'Fehler beim Freigeben des Kommentars:',
          error.response?.data?.message || error.message
        )
        throw error
      }
    },
    async addProf(professor) {
      const token = this.getToken()
      try {
        const response = await profAxios.post(`/add`, professor, {
          headers: { Authorization: `Bearer ${token}` }
        })

        console.log('Professor erfolgreich hinzugefügt:', response.data)

        // Erfolgreiche Benachrichtigung anzeigen
        Notify.create({
          type: 'positive',
          message: 'Professor erfolgreich hinzugefügt!',
          timeout: 3000
        })

        return response.data
      } catch (error) {
        // Fehlerbenachrichtigung anzeigen
        Notify.create({
          type: 'negative',
          message: error.response?.data?.message || 'Fehler beim Hinzufügen des Professors',
          timeout: 5000
        })

        console.error(
          'Fehler beim Hinzufügen des Professors:',
          error.response?.data?.message || error.message
        )
        throw error
      }
    },

    async fetchUsers() {
      const token = this.getToken()
      try {
        const response = await adminAxios.get(`/all`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.users = response.data
        return response
      } catch (error) {
        console.error(
          'Fehler beim Abrufen der Professoren: ',
          error.response?.data?.message || error.message
        )
        throw error
      }
    },
    async runScraper(linksFrontend, semesterFrontend) {
      console.log(linksFrontend, semesterFrontend);
      const token = this.getToken(); // Holt das Token aus dem Store oder lokalen Speicher
      try {
        const payload = { linksFrontend, semesterFrontend }; 
        console.log(payload); 
        const response = await adminAxios.post(`/scrape`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        
        Notify.create({
          type: 'positive',
          message: 'Scraping erfolgreich gestartet!',
          timeout: 3000
        });
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: error.response?.data?.message || 'Fehler beim Scraping',
          timeout: 5000
        });
        console.error('Fehler beim Scraping:', error.response?.data?.message || error.message);
        throw error;
      }
    },
    async createAndSetNewCollection(collectionName) {
      console.log(collectionName);
      const token = this.getToken();
      try {
        // Sende den semester-Wert im Request-Body
        await adminAxios.post(`/createAndSetNewCollection`, { collectionName }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Notify.create({
          type: 'positive',
          message: 'Neue Collection erfolgreich erstellt und als aktuell gesetzt!',
          timeout: 3000
        });
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: error.response?.data?.message || 'Fehler beim Erstellen der neuen Collection',
          timeout: 5000
        });
        console.error('Fehler beim Erstellen der neuen Collection:', error);
        throw error;
      }
    }
    
  }
})
