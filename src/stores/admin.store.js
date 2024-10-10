import { defineStore } from 'pinia'
import axios from 'axios'
import { useProfStore } from './prof.store'

const adminUrl = 'http://localhost:5000/api/admin'
const profUrl = 'http://localhost:5001/api/profs'

export const useAdminStore = defineStore('admin', {
    state: () => ({
      comments: [],
      users: [],
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
              const response = await axios.get(`${profUrl}/comments/all`);
              this.comments = response.data;
            } catch (error) {
              console.error('Fehler beim Abrufen der Kommentare: ', error.response?.data?.message || error.message);
              throw error;
            }
          },
          async deleteComment(commentId) {
            try {
              await axios.delete(`${profUrl}/comments/${commentId}`);
              this.comments = this.comments.filter(comment => comment._id !== commentId); // Kommentar aus dem State entfernen
            } catch (error) {
              console.error('Fehler beim Löschen des Kommentars:', error.response?.data?.message || error.message);
              throw error;
            }
          },
      
          async approveComment(profId, commentId, commentText) {
            try {
              // Sende den Kommentartext als Teil des Anfrage-Bodys
              await axios.post(`${profUrl}/comments/${profId}/release/${commentId}`, {
                commentText: commentText,
              });
              // Kommentar aus der lokalen Liste entfernen
              this.comments = this.comments.filter(comment => comment._id !== commentId);
            } catch (error) {
              console.error('Fehler beim Freigeben des Kommentars:', error.response?.data?.message || error.message);
              throw error;
            }
          },
          async fetchUsers() {
            const token = this.getToken()
            try {
              const response = await axios.get(`${adminUrl}/all`, {
                headers: { Authorization: `Bearer ${token}` }
              }) 
              this.users = response.data;
              return response;
            } catch (error) {
              console.error('Fehler beim Abrufen der Professoren: ', error.response?.data?.message || error.message)
              throw error
            }
          },
          async startScraper(links, semester) {
            const token = this.getToken()
            try {
              const payload = { links, semester };
              const response = await axios.post(`${adminUrl}/scrape`, payload, {
                headers: { Authorization: `Bearer ${token}` }
              });
              console.log(response.data);
              // Optional: Aktualisiere den State oder benachrichtige den Benutzer
            } catch (error) {
              console.error('Fehler beim Scraping:', error.response?.data?.message || error.message);
              throw error;
            }
          },

    }
})