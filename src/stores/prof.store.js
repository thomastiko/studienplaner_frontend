import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './user.store'
import { Notify } from 'quasar'

/**
 * API-URLs für Localhost
 */
//const profUrl = 'http://localhost:5001/api/profs'

/**
 * API-URLs für Stage
 */
const profUrl = 'https://taigowiz.org/api/profs';


export const useProfStore = defineStore('prof', {
    state: () => ({
      professors: [],
      selectedProf: null,
      profPreview: null,
      comments: [],
    }),

    actions: {
      getToken() {
        const token = localStorage.getItem('token')
        if (!token) {
          return null
        }
        return token
      },
        async fetchProfs() {
            try {
              const response = await axios.get(`${profUrl}/all`) 
              this.professors = response.data;
              return response;
            } catch (error) {
              console.error('Fehler beim Abrufen der Professoren: ', error.response?.data?.message || error.message)
              throw error
            }
          },
          async findProf(profId) {
            let prof = false;
      
            // first check if the prof is cached
            for (const p of this.professors) {
              if (p._id === profId) {
                prof = p;
              }
            }
            if (prof) {
              this.selectedProf = prof;
            }
      
            else {
              try {
                const response = await axios.get(`${profUrl}/byid/${profId}`);
      
                if (response.status === 200) {
                  this.selectedProf = response.data;
                }
              } catch (e) {
                return { status: e.code, message: e.message };
              }
            }
            console.log('Selected Prof:', this.selectedProf);
          },
          async fetchProfPreview(prof) {
            try {
              console.log('Prof:', prof);
              const response = await axios.post(
                `${profUrl}/preview`,
                {
                  fname: prof.fname,
                  lname: prof.lname
                 },
              );
              console.log('Professoren-Vorschau:', response.data);
              this.profPreview = response.data;
            } catch (error) {
              console.error('Fehler beim Abrufen der Professoren-Vorschau: ', error.response?.data?.message || error.message);
              throw error;
            }
          },
          async rateProfessor(profId, rating, router) {
            console.log('Rating:', rating)
            const userStore = useUserStore() // Zugriff auf den User Store
      
            // Authentifizierungsstatus überprüfen
            await userStore.checkAuthState(router)
      
            if (userStore.loggedIn) {
              try {
                const token = userStore.getToken() // Token abrufen
      
                // Anfrage an das Backend zum Hinzufügen eines Ratings senden
                const response = await axios.patch(
                  `${profUrl}/${profId}/rate`,
                  rating,
                  { headers: { Authorization: `Bearer ${token}` } }
                )
      
                console.log(`Rating für Professor ${profId} hinzugefügt:`, response.data)
      
                // Optional: Professor-Objekt im Store aktualisieren, falls das Backend die aktualisierten Daten zurücksendet
                const updatedProf = this.professors.find((p) => p._id === profId)
                if (updatedProf) {
                  updatedProf.ratings = response.data.ratings // Aktualisiere die Bewertungen, falls vorhanden
                }
      
              } catch (error) {
                console.error('Fehler beim Hinzufügen des Ratings: ', error.response?.data?.message || error.message)
                throw error
              }
            } else {
              console.error('Benutzer ist nicht eingeloggt')
              return
            }
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
          async deleteCommentSuggestion(commentId) {
            try {
              await axios.delete(`${profUrl}/comments/${commentId}`);
              this.comments = this.comments.filter(comment => comment._id !== commentId); // Kommentar aus dem State entfernen
            } catch (error) {
              console.error('Fehler beim Löschen des Kommentars:', error.response?.data?.message || error.message);
              throw error;
            }
          },
          async deleteComment(profId, comment) {
            try {
              const response = await axios.delete(`${profUrl}/${profId}/comments`, {
                data: { comment }
              });
              this.selectedProf = response.data;
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
          async deleteProfessor(profId) {
            try {
              await axios.delete(`${profUrl}/${profId}`);
              this.professors = this.professors.filter(prof => prof._id !== profId);
              Notify.create({
                type: 'positive',
                message: 'Professor erfolgreich gelöscht!',
                timeout: 3000
              });
            } catch (error) {
              Notify.create({
                type: 'negative',
                message: 'Fehler beim Löschen des Professors!',
                timeout: 3000
              });
              console.error('Fehler beim Löschen des Professors:', error.response?.data?.message || error.message);
              throw error;
            }
          }
    }
})