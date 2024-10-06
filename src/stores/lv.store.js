import { defineStore } from 'pinia'
import axios from 'axios'

const apiUrl = 'http://localhost:5000/api/auth'
const lvUrl = 'http://localhost:5000/api/user/lv'

export const useLvStore = defineStore("lv", {
    state: () => {
        return {
            // store shopping cart
            cart: [
                /**
                 * name: string,
                 * ects: number
                 */
            ],
            // courses coming from getCourses are stored here
            list: [
                /*
                * _id: string,
                * name: string,
                * subject_name: string,
                * ...
                */
            ],
            // course_ids coming from getRegisteredCourse are stored here
            course_ids: [
                /**
                 * id: string
                 */
            ],
            // courses coming from getCoursesForIdList are stored here
            calendar: [
                /**
                * _id: string,
                * name: string,
                * subject_name: string,
                * ...
                 */
            ],
        }
    },

  actions: {
    async fetchCourses() {
      try {
          const response = await axios.get(`${lvUrl}/search`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`, // Token aus dem lokalen Speicher hinzufügen
              },
          });

          this.list = response.data; // Kurse im List-Array speichern
      } catch (error) {
          console.error('Error fetching courses:', error);
          // Optional: Fehlerbehandlung hinzufügen, z.B. eine Benachrichtigung anzeigen
      }
  },
  }
})
