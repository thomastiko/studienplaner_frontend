import { defineStore } from 'pinia'
import axios from 'axios'

const profUrl = 'http://localhost:5001/api/profs'

export const useProfStore = defineStore('prof', {
    state: () => ({
      professors: []
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
          }
    }
})