import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './user.store'

const profUrl = 'http://localhost:5001/api/profs'

export const useProfStore = defineStore('prof', {
    state: () => ({
      professors: [],
      selectedProf: null,
    }),

    actions: {
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
    }
})