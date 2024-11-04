import { defineStore } from 'pinia'
import axios from 'axios'


/**
 * API-URLs für Localhost
 */
const apiUrl = 'http://localhost:5000/api/auth'
const url = 'http://localhost:5000/api/user'


/**
 * API-Urls für Stage
 */

//const apiUrl = 'https://taigowiz.org/api/auth';
//const url = 'https://taigowiz.org/api/user';


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
  getters: {
    allCurrentSubjects: (state) => (studyId) => {
      if (!state.user.studies || !state.user.studies.length) return [];

      const selectedStudy = state.user.studies.find(study => study.study_id === studyId);
      if (!selectedStudy || !selectedStudy.subject_states) return [];

      const excludedCategories = ['Spezielle Betriebswirtschaftslehre', 'Freies Wahlfach', 'Specializations', 'Free Electives and Internship'];

      const currentSubjects = selectedStudy.subject_states.filter(
        subject => subject.status === 'doing' && !excludedCategories.includes(subject.category)
      );

      const currentSbwlSubjects = selectedStudy.sbwl_states?.flatMap(sbwl => 
        sbwl.subjects?.filter(subject => subject.status === 'doing') || []
      ) || [];

      const currentFreeElectives = selectedStudy.free_electives?.filter(
        elective => elective.status === 'doing'
      ) || [];

      return [...currentSubjects, ...currentSbwlSubjects, ...currentFreeElectives];
    },

    // Berechnet die aktuellen ECTS direkt basierend auf dem `studyId` und den aktuellen Fächern
    allCurrentEcts: (state) => (studyId) => {
      if (!state.user.studies || !state.user.studies.length) return 0;

      const selectedStudy = state.user.studies.find(study => study.study_id === studyId);
      if (!selectedStudy || !selectedStudy.subject_states) return 0;

      const excludedCategories = ['Spezielle Betriebswirtschaftslehre', 'Freies Wahlfach', 'Specializations', 'Free Electives and Internship'];

      // Finde die aktuellen Fächer und SBWLs, die gerade "doing" sind
      const currentSubjects = selectedStudy.subject_states.filter(
        subject => subject.status === 'doing' && !excludedCategories.includes(subject.category)
      );

      const currentSbwlSubjects = selectedStudy.sbwl_states?.flatMap(sbwl => 
        sbwl.subjects?.filter(subject => subject.status === 'doing') || []
      ) || [];

      const currentFreeElectives = selectedStudy.free_electives?.filter(
        elective => elective.status === 'doing'
      ) || [];

      // Berechnung der ECTS
      const allCurrentSubjects = [...currentSubjects, ...currentSbwlSubjects, ...currentFreeElectives];
      return allCurrentSubjects.reduce((acc, subject) => acc + (subject.ects || 0), 0);
    },

    allCompletedSubjects: (state) => (studyId) => {
      if (!state.user.studies || !state.user.studies.length) return [];

      const selectedStudy = state.user.studies.find(study => study.study_id === studyId);
      if (!selectedStudy || !selectedStudy.subject_states) return [];

      const excludedCategories = ['Spezielle Betriebswirtschaftslehre', 'Freies Wahlfach', 'Specializations', 'Free Electives and Internship'];

      const completedSubjects = selectedStudy.subject_states.filter(
        subject => subject.status === 'done' && !excludedCategories.includes(subject.category)
      );

      const completedSbwlSubjects = selectedStudy.sbwl_states?.flatMap(sbwl => 
        sbwl.subjects?.filter(subject => subject.status === 'done') || []
      ) || [];

      const completedFreeElectives = selectedStudy.free_electives?.filter(
        elective => elective.status === 'done'
      ) || [];

      return [...completedSubjects, ...completedSbwlSubjects, ...completedFreeElectives];
    },

    // Berechnet die abgeschlossenen ECTS direkt basierend auf dem `studyId` und den abgeschlossenen Fächern
    allCompletedEcts: (state) => (studyId) => {
      if (!state.user.studies || !state.user.studies.length) return 0;

      const selectedStudy = state.user.studies.find(study => study.study_id === studyId);
      if (!selectedStudy || !selectedStudy.subject_states) return 0;

      const excludedCategories = ['Spezielle Betriebswirtschaftslehre', 'Freies Wahlfach', 'Specializations', 'Free Electives and Internship'];

      // Finde die abgeschlossenen Fächer und SBWLs, die den Status "done" haben
      const completedSubjects = selectedStudy.subject_states.filter(
        subject => subject.status === 'done' && !excludedCategories.includes(subject.category)
      );

      const completedSbwlSubjects = selectedStudy.sbwl_states?.flatMap(sbwl => 
        sbwl.subjects?.filter(subject => subject.status === 'done') || []
      ) || [];

      const completedFreeElectives = selectedStudy.free_electives?.filter(
        elective => elective.status === 'done'
      ) || [];

      // Berechnung der ECTS
      const allCompletedSubjects = [...completedSubjects, ...completedSbwlSubjects, ...completedFreeElectives];
      return allCompletedSubjects.reduce((acc, subject) => acc + (subject.ects || 0), 0);
    },
    // Berechnet den gewichteten Notendurchschnitt (GPA)
    gpa: (state) => (studyId) => {
      if (!state.user.studies || !state.user.studies.length) return '-';
    
      const selectedStudy = state.user.studies.find(study => study.study_id === studyId);
      if (!selectedStudy) return '-';
    
      // Finde die Fächer in subject_states, die eine Note haben
      const gradedSubjects = selectedStudy.subject_states.filter(
        subject => subject.status === 'done' && subject.grade != null
      );
    
      // Finde die Fächer in sbwl_states.subjects, die eine Note haben
      const gradedSbwlSubjects = selectedStudy.sbwl_states
        .flatMap(sbwl => sbwl.subjects) // Greift auf alle subjects in jedem sbwl zu
        .filter(subject => subject.status === 'done' && subject.grade != null);
    
      // Finde die Fächer in free_electives, die eine Note haben
      const gradedFreeElectives = selectedStudy.free_electives.filter(
        elective => elective.ects > 0 && elective.grade != null // Da alle auf done sind, nur auf ECTS und grade prüfen
      );
    
      // Kombiniere alle bewerteten Fächer
      const allGradedSubjects = [...gradedSubjects, ...gradedSbwlSubjects, ...gradedFreeElectives];
    
      // Berechne den gewichteten GPA basierend auf den ECTS
      const totalWeightedGrade = allGradedSubjects.reduce(
        (acc, subject) => acc + (subject.grade * subject.ects), 0
      );
      const totalEcts = allGradedSubjects.reduce((acc, subject) => acc + (subject.ects || 0), 0);
    
      return totalEcts ? (totalWeightedGrade / totalEcts).toFixed(2) : '-';
    },
  },
  
  

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
    async updateBulkSubjectStatus(studyId, subjects) {
      try {
        const token = this.getToken() // Token über die neue Methode abrufen
        const response = await axios.patch(
          `${url}/studies/${studyId}/subjects/bulk`,
          { studyId, subjects },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        console.log(response.data)
        const updatedSubjects = response.data.subjects

        // Suche den Study im Store basierend auf studyId
        const study = this.user.studies.find((s) => s.study_id === studyId)

        if (!study) {
          console.error(`Studiengang mit der ID ${studyId} nicht gefunden`)
          return
        }

        // Aktualisiere den Status der Fächer
        updatedSubjects.forEach((updatedSubject) => {
          const subjectToUpdate = study.subject_states.find((s) => s._id === updatedSubject._id)

          if (!subjectToUpdate) {
            console.error(`Fach mit der ID ${updatedSubject._id} nicht im Studiengang ${studyId} gefunden`)
            return
          }

          // Aktualisiere den Status des Faches
          subjectToUpdate.status = updatedSubject.status
          subjectToUpdate.grade = updatedSubject.grade

        })

        console.log(this.user.studies)
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.error('Fehler beim Hinzufügen des Studiengangs:', error.response.data.message);
          throw new Error(error.response.data.message); // Nachricht vom Backend an das Frontend weiterleiten
        } else {
          console.error('Fehler beim Hinzufügen des Studiengangs:', error.message || error);
          throw error; // Andere Fehler weitergeben
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
    async addCoursesAbroadToStudy(studyId, coursesAbroad) {
      try {
        const token = this.getToken()
        const response = await axios.post(
          `${url}/studies/${studyId}/courses-abroad`,
          { studyId, coursesAbroad },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        const study = this.user.studies.find((s) => s.study_id === studyId)
        study.sbwl_states = response.data.sbwl_states
      } catch (error) {
        console.error('Fehler beim Hinzufügen der Auslandssemester:', error)
        throw error
      }
    },
    async deleteSubjectsFromCourseAbroad(studyId, coursesAbroad) {
      try {
        const token = this.getToken()
        const response = await axios.delete(`${url}/studies/${studyId}/courses-abroad`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { studyId, coursesAbroad }
        })
        const study = this.user.studies.find((s) => s.study_id === studyId)
        study.sbwl_states = response.data.sbwl_states
        console.log(response.data.sbwl_states)
      } catch (error) {
        console.error('Fehler beim Löschen der Auslandssemester:', error)
        throw error
      }
    },
    async deleteSbwlFromStudy(studyId, sbwl) {
      try {
        const token = this.getToken()
        const response = await axios.delete(`${url}/studies/${studyId}/sbwls/${sbwl.sbwl_name}`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { studyId, sbwl }
        })
        const study = this.user.studies.find((s) => s.study_id === studyId)
        study.sbwl_states = response.data.sbwl_states
      } catch (error) {
        console.error('Fehler beim Löschen der SBWL:', error)
        throw error
      }
    },
    async updateSbwlSubjectStatus(studyId, subjectId, status, grade, sbwl) {
      try {
        const token = this.getToken();
        const response = await axios.patch(
          `${url}/studies/${studyId}/sbwls/${sbwl.sbwl_name}`,
          { studyId, subjectId, status, grade, sbwl },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        console.log(response.data);
        const updatedSubject = response.data.subject;
    
        // Suche den Study im Store basierend auf studyId
        const study = this.user.studies.find((s) => s.study_id === studyId);
    
        if (!study) {
          console.error(`Studiengang mit der ID ${studyId} nicht gefunden`);
          return;
        }
    
        // Suche das Fach (subject) im study.subject_states basierend auf subject._id
        const sbwlToUpdate = study.sbwl_states.find((s) => s.sbwl_name === sbwl.sbwl_name);
    
        if (sbwlToUpdate) {
          const subjectToUpdate = sbwlToUpdate.subjects.find(
            (subject) => subject._id === subjectId
          );
          if (subjectToUpdate) {
            // Aktualisiere den Status des Faches
            subjectToUpdate.status = updatedSubject.status;
            subjectToUpdate.grade = updatedSubject.grade;
            console.log('Subject gefunden:', subjectToUpdate);
    
            console.log(
              `Status des Faches ${subjectToUpdate.name} aktualisiert auf ${updatedSubject.status} und Note ${updatedSubject.grade}`
            );
            console.log(this.user.studies);
          } else {
            console.log('Kein passendes Subject gefunden');
          }
        } else {
          console.log('Keine passende SBWL gefunden');
        }
    
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.error('Fehler beim Hinzufügen des Studiengangs:', error.response.data.message);
          throw new Error(error.response.data.message); // Nachricht vom Backend an das Frontend weiterleiten
        } else {
          console.error('Fehler beim Hinzufügen des Studiengangs:', error.message || error);
          throw error; // Andere Fehler weitergeben
        }
      }
    },
    /* USER FREE ELECTIVES ADDING/REMOVING/UPDATING */
    /************************************************************************************/

    async addFreeElectiveToStudy(studyId, freeElective) {
      try {
        const token = this.getToken()
        const response = await axios.post(
          `${url}/studies/${studyId}/free-electives`,
          { studyId, freeElective },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        console.log(freeElective)
        const study = this.user.studies.find((s) => s.study_id === studyId)
        study.free_electives = response.data.free_electives
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Wahlfachs:', error)
        throw error
      }
    },
    async deleteFreeElectiveFromStudy(studyId, freeElective) {
      try {
        const token = this.getToken()
        const response = await axios.delete(`${url}/studies/${studyId}/free-electives`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { studyId, freeElective }
        })
        const study = this.user.studies.find((s) => s.study_id === studyId)
        study.free_electives = response.data.free_electives
      } catch (error) {
        console.error('Fehler beim Löschen des Wahlfachs:', error)
        throw error
      }
    },
    async deleteEveryFreeElectiveFromStudy(studyId) {
      try {
        const token = this.getToken()
        const response = await axios.delete(`${url}/studies/${studyId}/free-electives/all`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const study = this.user.studies.find((s) => s.study_id === studyId)
        study.free_electives = response.data.free_electives
      } catch (error) {
        console.error('Fehler beim Löschen aller Wahlfächer:', error)
        throw error
      }
    },
    

    /* USER CALENDAR ADDING/REMOVING/UPDATING */
    /************************************************************************************/

    async addCourse(course) {
      console.log(course)
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
