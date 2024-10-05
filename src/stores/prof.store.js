import { defineStore } from 'pinia'
import axios from 'axios'

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
    }
})