import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './user.store'
import { Notify } from 'quasar'
import { i18n } from '@/main';

/**
 * API-URLs für Localhost
 */
const profUrl = 'http://localhost:5001/api/profs'

/**
 * API-URLs für Stage
 */
//const profUrl = 'https://taigowiz.org/api/profs';


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
          // Backend liefert nur Teil-Daten (Projection)
          const response = await axios.get(`${profUrl}/all`);
      
          // Wir hängen jedem Eintrag ein Flag an, das ihn als 'teilweise Daten' kennzeichnet
          const partialData = response.data.map((prof) => ({
            ...prof,
            _fullData: false // Kennzeichnet: Das ist nur eine Teilladung
          }));
      
          this.professors = partialData;
      
          return response;
        } catch (error) {
          console.error('[fetchProfs] Fehler beim Abrufen der Professoren: ', error.response?.data?.message || error.message);
          throw error;
        }
      },
      async findProf(profId) {
      
        // Suche Prof nach _id
        let prof = this.professors.find((p) => p._id === profId);
      
        // Fall A) Prof existiert NICHT im Array -> Wir laden ihn direkt vom Server
        if (!prof) {
          try {
            const response = await axios.get(`${profUrl}/byid/${profId}`);
            if (response.status === 200) {
              prof = {
                ...response.data,
                _fullData: true
              };
              this.professors.push(prof);
            }
          } catch (e) {
            console.error('[findProf] Error fetching Prof:', e.response?.data?.message || e.message);
            return { status: e.code, message: e.message };
          }
        }
        // Fall B) Prof existiert im Array, aber nur als Teildaten -> Hole Vollversion
        else if (!prof._fullData) {
          try {
            const response = await axios.get(`${profUrl}/byid/${profId}`);
            if (response.status === 200) {
              // Prof-Daten updaten
              const index = this.professors.findIndex((p) => p._id === profId);
              prof = {
                ...response.data,
                _fullData: true
              };
              this.professors[index] = prof;
            }
          } catch (e) {
            console.error('[findProf] Error fetching Prof:', e.response?.data?.message || e.message);
            return { status: e.code, message: e.message };
          }
        }
        // Fall C) Prof existiert bereits im Array und ist _fullData=true
        else {
        }
      
        this.selectedProf = prof;
      },

          async fetchProfPreview(prof) {
            try {
              const response = await axios.post(
                `${profUrl}/preview`,
                {
                  fname: prof.fname,
                  lname: prof.lname
                 },
              );
              this.profPreview = response.data;
              console.log('Professoren-Vorschau:', this.profPreview);
            } catch (error) {
              console.error('Fehler beim Abrufen der Professoren-Vorschau: ', error.response?.data?.message || error.message);
              throw error;
            }
          },
          async rateProfessor(profId, rating, router, notify) {
            const userStore = useUserStore();
          
            // Authentifizierungsstatus überprüfen
            await userStore.checkAuthState(router);
          
            if (userStore.loggedIn) {
              // Beispiel: rating = { ratings: [...], comment: '...'}
              // Prüfen, ob 'ratings' existiert und ob einer der Werte = 0 ist
              if (
                !rating.ratings ||
                rating.ratings.some((value) => value === 0)
              ) {
                notify({
                  type: 'negative',
                  message: i18n.global.t('rateProf.not_all_fields_filled'),
                  position: 'bottom',
                  timeout: 3000
                });
                return; // Abbruch, kein Request wird gesendet
              }
          
              try {
                const token = userStore.getToken();
          
                const response = await axios.patch(
                  `${profUrl}/${profId}/rate`,
                  rating, 
                  { headers: { Authorization: `Bearer ${token}` } }
                );
        
          
                // Professor in deinem lokalen State aktualisieren
                const updatedProf = this.professors.find((p) => p._id === profId);
                if (updatedProf) {
                  updatedProf.ratings = response.data.ratings;
                }
                notify({
                  type: 'positive',
                  spinner: true,
                  message: i18n.global.t('rateProf.adding_rating'),
                  position: 'bottom',
                  group: false,
                  timeout: 3000
                });  
                setTimeout(() => {
                  router.back();
                  window.addEventListener('popstate', () => location.reload(), { once: true });
                }, 3000);
          
              } catch (error) {
                if (error.response?.status === 409) {
                  notify({
                    type: 'negative',
                    message: i18n.global.t('rateProf.prof_already_rated'),
                    position: 'bottom',
                    timeout: 3000
                  });
                } else {
                  notify({
                    type: 'negative',
                    message: i18n.global.t('rateProf.error_while_adding_rating'),
                    position: 'bottom',
                    timeout: 3000
                  });
                  console.error('Fehler beim Hinzufügen des Ratings:', error.response?.data?.message || error.message);
                  throw error;
                }
              }
            } else {
              console.error('Benutzer ist nicht eingeloggt');
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