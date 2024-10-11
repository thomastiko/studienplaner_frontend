import { defineStore } from 'pinia'
import axios from 'axios'

const apiUrl = 'http://localhost:5000/api/auth'
const url = 'http://localhost:5000/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    loggedIn: false,
    user: {
      email: '',
      student_id: '',
      role: '',
      studies: [], // Studiengänge werden hier gespeichert
      course_entries: [] // Kursbelegungen
    }
  }),

  actions: {
    /* USER LOGIN/LOGOUT & FETCH USER & AUTH */
    /************************************************************************************/

    getToken() {
      const token = localStorage.getItem('token')
      if (!token) {
        return null
      }
      return token
    },
    async login(email, password, router) {
      try {
        const response = await axios.post(`${apiUrl}/login`, { email, password })

        localStorage.setItem('token', response.data.token)

        this.loggedIn = true
        this.user = {
          email: response.data.email,
          student_id: response.data.student_id,
          role: response.data.role,
          studies: response.data.studies,
          course_entries: response.data.course_entries
        }

        router.push({ name: 'my-study', path: '/my-study' })
      } catch (error) {
        console.error('Login-Fehler: ', error.response?.data?.message || error.message)
        throw error
      }
    },
    async logout(router) {
      try {
        await axios.post(
          `${apiUrl}/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        )

        this.clearAuthState()
        router.push({ name: 'login', path: '/login' })
      } catch (error) {
        console.error('Logout-Fehler: ', error)
        this.clearAuthState()
      }
    },

    clearAuthState() {
      this.loggedIn = false
      this.user = { email: '', student_id: '', role: '', studies: [], course_entries: [] }
      localStorage.removeItem('token')
    },

    async fetchUser(router) {
      try {
        const token = this.getToken()
        if (!token) {
          this.clearAuthState()
          router.push({ name: 'login', path: '/login' })
          return
        }

        const response = await axios.get(`${url}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        this.user = {
          email: response.data.email,
          student_id: response.data.student_id,
          role: response.data.role,
          studies: response.data.studies,
          course_entries: response.data.course_entries
        }
        this.loggedIn = true
      } catch (error) {
        console.error('Fehler beim Abrufen der Benutzerdaten: ', error)
        this.clearAuthState()
      }
    },

    async checkAuthState(router) {
      const token = this.getToken()
      if (token) {
        await this.fetchUser()
      } else {
        this.clearAuthState()
        router.push({ name: 'login', path: '/login' })
      }
    },

    /* USER STUDY ADDING/REMOVING/UPDATING */
    /************************************************************************************/

    async addStudy(studyId) {
      try {
        const token = this.getToken() // Token über die neue Methode abrufen

        const response = await axios.post(
          `${url}/studies/${studyId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        this.user.studies.push(response.data)
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.error('Fehler beim Hinzufügen des Studiengangs:', error.response.data.message)
          throw new Error(error.response.data.message) // Nachricht vom Backend an das Frontend weiterleiten
        } else {
          console.error('Fehler beim Hinzufügen des Studiengangs:', error.message || error)
          throw error // Andere Fehler weitergeben
        }
      }
    },
    async deleteStudy(studyId) {
      try {
        const token = this.getToken()
        const response = await axios.delete(`${url}/studies/${studyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.user.studies = response.data.studies
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.error('Fehler beim Löschen des Studiengangs:', error.response.data.message)
          throw new Error(error.response.data.message)
        } else {
          console.error('Fehler beim Löschen des Studiengangs:', error.message || error)
          throw error
        }
      }
    },
    async updateSubjectStatus(studyId, subjectId, status, grade) {
      try {
        const token = this.getToken() // Token über die neue Methode abrufen

        const response = await axios.patch(
          `${url}/studies/${studyId}/subjects`,
          { studyId, subjectId, status, grade },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        console.log(response.data)
        const updatedSubject = response.data.subject

        // Suche den Study im Store basierend auf studyId
        const study = this.user.studies.find((s) => s.study_id === studyId)

        if (!study) {
          console.error(`Studiengang mit der ID ${studyId} nicht gefunden`)
          return
        }

        // Suche das Fach (subject) im study.subject_states basierend auf subject._id
        const subjectToUpdate = study.subject_states.find((s) => s._id === subjectId)

        if (!subjectToUpdate) {
          console.error(`Fach mit der ID ${subjectId} nicht im Studiengang ${studyId} gefunden`)
          return
        }

        // Aktualisiere den Status des Faches
        subjectToUpdate.status = updatedSubject.status
        subjectToUpdate.grade = updatedSubject.grade

        console.log(
          `Status des Faches ${subjectToUpdate.name} aktualisiert auf ${updatedSubject.status} und Note ${updatedSubject.grade}`
        )
        console.log(this.user.studies)
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.error('Fehler beim Hinzufügen des Studiengangs:', error.response.data.message)
          throw new Error(error.response.data.message) // Nachricht vom Backend an das Frontend weiterleiten
        } else {
          console.error('Fehler beim Hinzufügen des Studiengangs:', error.message || error)
          throw error // Andere Fehler weitergeben
        }
      }
    },
    /** USER SBWL ADDING/REMOVING/UPDATING */
    /************************************************************************ */
    async addSbwlToStudy(studyId, sbwl) {
      try {
        const token = this.getToken()
        const response = await axios.post(
          `${url}/studies/${studyId}/sbwls/${sbwl.name}`,
          { studyId, sbwl },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        const study = this.user.studies.find((s) => s.study_id === studyId)
        study.sbwl_states = response.data.sbwl_states
      } catch (error) {
        console.error('Fehler beim Hinzufügen der SBWL:', error)
        throw error
      }
    },
    async deleteSbwlFromStudy(studyId, sbwl) {
      try {
        const token = this.getToken()
        const response = await axios.delete(
          `${url}/studies/${studyId}/sbwls/${sbwl.sbwl_name}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            data: { studyId, sbwl }
          }
        )
        const study = this.user.studies.find((s) => s.study_id === studyId)
        study.sbwl_states = response.data.sbwl_states
      } catch (error) {
        console.error('Fehler beim Löschen der SBWL:', error)
        throw error
      }
    },

    /* USER CALENDAR ADDING/REMOVING/UPDATING */
    /************************************************************************************/

    async addCourse(course) {
      try {
        const token = this.getToken()
        course.color = '#5bbdf4' // Setze eine Standardfarbe für den Kurs
        // Füge den Kurs zur Benutzerobjekt hinzu
        this.user.course_entries.push(course)

        // Optional: Sende den Kurs an das Backend zur dauerhaften Speicherung
        await axios.post(`${url}/course`, course, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Kurses:', error)
        throw error
      }
    },
    async deleteCourse(courseCode, semester) {
      try {
        const token = this.getToken() // Token für die Authentifizierung abrufen

        // Sende die Anfrage zum Löschen des Kurses an das Backend
        const response = await axios.delete(`${url}/course`, {
          headers: { Authorization: `Bearer ${token}` }, // Token in den Header einfügen
          data: { courseCode, semester } // Die Kursdaten im Body der Anfrage senden
        })

        this.user = response.data.user // Aktualisiere die Benutzerinformationen mit den neuen Kursdaten
      } catch (error) {
        console.error('Fehler beim Löschen des Kurses:', error)
        throw error // Werfe den Fehler weiter, damit der Aufrufer darauf reagieren kann
      }
    },
    async updateCourseColor(courseCode, semester, newColor) {
      try {
        const token = this.getToken()

        // Send a request to the backend to update the course color
        await axios.patch(
          `${url}/course`,
          { courseCode, semester, color: newColor },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        // Update the color in the local state
        const course = this.user.course_entries.find(
          (c) => c.course_code === courseCode && c.semester === semester
        )
        if (course) {
          course.color = newColor
        }
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Kursfarbe:', error)
        throw error
      }
    }
  }
})
