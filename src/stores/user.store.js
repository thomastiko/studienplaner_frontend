import { defineStore } from 'pinia'
import { authAxios, userAxios } from './config';
import { i18n } from '@/main';


/**
 * Change the URL APIs in the config.js file
 */


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
      if (!state.user.studies || !state.user.studies.length) return []

      const selectedStudy = state.user.studies.find((study) => study.study_id === studyId)
      if (!selectedStudy || !selectedStudy.subject_states) return []

      const excludedCategories = [
        'Spezielle Betriebswirtschaftslehre',
        'Freies Wahlfach',
        'Specializations',
        'Free Electives and Internship'
      ]

      const currentSubjects = selectedStudy.subject_states.filter(
        (subject) => subject.status === 'doing' && !excludedCategories.includes(subject.category)
      )

      const currentSbwlSubjects =
        selectedStudy.sbwl_states?.flatMap(
          (sbwl) => sbwl.subjects?.filter((subject) => subject.status === 'doing') || []
        ) || []

      const currentFreeElectives =
        selectedStudy.free_electives?.filter((elective) => elective.status === 'doing') || []

      return [...currentSubjects, ...currentSbwlSubjects, ...currentFreeElectives]
    },

    // Berechnet die aktuellen ECTS direkt basierend auf dem `studyId` und den aktuellen Fächern
    allCurrentEcts: (state) => (studyId) => {
      if (!state.user.studies || !state.user.studies.length) return 0

      const selectedStudy = state.user.studies.find((study) => study.study_id === studyId)
      if (!selectedStudy || !selectedStudy.subject_states) return 0

      const excludedCategories = [
        'Spezielle Betriebswirtschaftslehre',
        'Freies Wahlfach',
        'Specializations',
        'Free Electives and Internship'
      ]

      // Finde die aktuellen Fächer und SBWLs, die gerade "doing" sind
      const currentSubjects = selectedStudy.subject_states.filter(
        (subject) => subject.status === 'doing' && !excludedCategories.includes(subject.category)
      )

      const currentSbwlSubjects =
        selectedStudy.sbwl_states?.flatMap(
          (sbwl) => sbwl.subjects?.filter((subject) => subject.status === 'doing') || []
        ) || []

      const currentFreeElectives =
        selectedStudy.free_electives?.filter((elective) => elective.status === 'doing') || []

      // Berechnung der ECTS
      const allCurrentSubjects = [
        ...currentSubjects,
        ...currentSbwlSubjects,
        ...currentFreeElectives
      ]
      return allCurrentSubjects.reduce((acc, subject) => acc + (subject.ects || 0), 0)
    },

    allCompletedSubjects: (state) => (studyId) => {
      if (!state.user.studies || !state.user.studies.length) return []

      const selectedStudy = state.user.studies.find((study) => study.study_id === studyId)
      if (!selectedStudy || !selectedStudy.subject_states) return []

      const excludedCategories = [
        'Spezielle Betriebswirtschaftslehre',
        'Freies Wahlfach',
        'Specializations',
        'Free Electives and Internship'
      ]

      const completedSubjects = selectedStudy.subject_states.filter(
        (subject) => subject.status === 'done' && !excludedCategories.includes(subject.category)
      )

      const completedSbwlSubjects =
        selectedStudy.sbwl_states?.flatMap(
          (sbwl) => sbwl.subjects?.filter((subject) => subject.status === 'done') || []
        ) || []

      const completedFreeElectives = selectedStudy.free_electives || []

      return [...completedSubjects, ...completedSbwlSubjects, ...completedFreeElectives]
    },

    // Berechnet die abgeschlossenen ECTS direkt basierend auf dem `studyId` und den abgeschlossenen Fächern
    allCompletedEcts: (state) => (studyId) => {
      if (!state.user.studies || !state.user.studies.length)
        return { totalEcts: 0, overflowEcts: 0 }

      const selectedStudy = state.user.studies.find((study) => study.study_id === studyId)
      if (!selectedStudy || !selectedStudy.subject_states) return { totalEcts: 0, overflowEcts: 0 }

      const excludedCategories = [
        'Spezielle Betriebswirtschaftslehre',
        'Freies Wahlfach',
        'Specializations',
        'Free Electives and Internship'
      ]

      // Finde die abgeschlossenen Fächer und SBWLs, die den Status "done" haben
      const completedSubjects = selectedStudy.subject_states.filter(
        (subject) => subject.status === 'done' && !excludedCategories.includes(subject.category)
      )

      const completedSbwlSubjects =
        selectedStudy.sbwl_states?.flatMap(
          (sbwl) => sbwl.subjects?.filter((subject) => subject.status === 'done') || []
        ) || []

      const completedFreeElectives = selectedStudy.free_electives || []

      // Berechnung der ECTS
      const allCompletedSubjects = [
        ...completedSubjects,
        ...completedSbwlSubjects,
        ...completedFreeElectives
      ]
      const totalEcts = allCompletedSubjects.reduce((acc, subject) => acc + (subject.ects || 0), 0)

      // Maximal 180 ECTS, Überschuss in overflowEcts speichern
      const maxEcts = 180
      const overflowEcts = totalEcts > maxEcts ? totalEcts - maxEcts : 0
      const limitedEcts = totalEcts > maxEcts ? maxEcts : totalEcts

      return { totalEcts: limitedEcts, overflowEcts }
    },
    // Berechnet den gewichteten Notendurchschnitt (GPA)
    gpa: (state) => (studyId) => {
      if (!state.user.studies || !state.user.studies.length) return '-';
    
      const selectedStudy = state.user.studies.find((study) => study.study_id === studyId);
      if (!selectedStudy) return '-';
    
      // Maximal erlaubte ECTS
      const maxEcts = 180;
    
      // Arrays für bewertete und unbewertete Fächer
      const gradedSubjects = [];
      const ungradedSubjects = [];
    
      // Sortiere die Fächer (unchanged)
      for (const subject of [
        ...selectedStudy.subject_states,
        ...selectedStudy.sbwl_states.flatMap((sbwl) => sbwl.subjects || []),
        ...selectedStudy.free_electives,
      ]) {
        if (selectedStudy.free_electives.includes(subject) && subject.grade != null) {
          gradedSubjects.push(subject); // Bewertete Fächer aus free_electives
        } else if (selectedStudy.free_electives.includes(subject) && subject.grade == null) {
          ungradedSubjects.push(subject); // Unbewertete Fächer aus free_electives
        } else if (subject.status === 'done' && subject.grade != null) {
          gradedSubjects.push(subject); // Andere bewertete Fächer
        }
      }
    
      // Debugging-Logs für Übersicht
    
      // Initialisiere Zähler
      let totalWeightedGrade = 0; // Gewichtete Notensumme
      let gradedEctsForGpa = 0; // Nur bewertete ECTS
      let totalEctsUsed = 0; // Gesamte ECTS

      // 2. Verarbeite bewertete Fächer (GPA-relevant)
      gradedSubjects.forEach((subject) => {
        if (totalEctsUsed < maxEcts) {
          const remainingEcts = maxEcts - totalEctsUsed;
          const ectsToAdd = Math.min(subject.ects, remainingEcts);
          totalWeightedGrade += subject.grade * ectsToAdd;
          gradedEctsForGpa += ectsToAdd;
          totalEctsUsed += ectsToAdd;
    
        }
      });
    
      // 1. Verarbeite unbewertete Fächer (nur ECTS zählen, ohne GPA-Einfluss)
      ungradedSubjects.forEach((subject) => {
        if (totalEctsUsed < maxEcts) {
          const remainingEcts = maxEcts - totalEctsUsed;
          const ectsToAdd = Math.min(subject.ects, remainingEcts);
          totalEctsUsed += ectsToAdd;
    
        }
      });
    
      // Logs vor der finalen Berechnung
    
      // Berechne den GPA
      const finalGpa = gradedEctsForGpa > 0
        ? (totalWeightedGrade / gradedEctsForGpa).toFixed(2) // Gewichteter Durchschnitt
        : '-'; // Kein GPA verfügbar
    
      return finalGpa;
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
    
    async login(email, password, router, notify) {
      try {
        const response = await authAxios.post('/login', { email, password });
        const token = response.data.token;

        localStorage.setItem('token', token);
        //setAuthToken(token);

        this.loggedIn = true
        this.user = {
          id: response.data.userId,
          email: response.data.email,
          //student_id: response.data.student_id,
          role: response.data.role,
          studies: response.data.studies,
        }
        console.log('Erfolgreich angemeldet:', this.user)

        // Redirect abhängig ob Studiengänge vorhanden sind	
        if(this.user.studies.length == 0) {
          router.push({ name: 'studies', path: 'studies' })
          setTimeout(() => {
            window.location.reload()
          }, 100)
        } else {
          router.push({ name: 'my-study', path: '/my-study' })
          setTimeout(() => {
            window.location.reload()
          }, 500)
        }
        // Zeige Benachrichtigung an
        notify({
          message: i18n.global.t('userNotify.successfully_logged_in'),
          type: 'success',
          color: 'positive',
          position: 'bottom'
        })



        // Führe einen Seiten-Refresh durch, nachdem zur My-Study-Seite navigiert wurde
        /*setTimeout(() => {
          window.location.reload()
        }, 500)*/ // optionaler Timeout, um sicherzustellen, dass die Navigation vollständig ist
      } catch (error) {
        notify({
          message: i18n.global.t('userNotify.error_while_logging_in'),
          type: 'error',
          color: 'negative',
          position: 'bottom'
        })

        console.error('Login-Fehler: ', error.response?.data?.message || error.message)
        throw error
      }
    },
    async logout(router, notify) {
      try {
        await authAxios.post('/logout');
        this.clearAuthState();

        this.clearAuthState()
        router.push({ name: 'login', path: '/login' })
        notify({
          message: i18n.global.t('userNotify.successfully_logged_out'),
          type: 'success',
          color: 'positive',
          position: 'bottom'
        })
      } catch (error) {
        notify({
          message: i18n.global.t('userNotify.error_while_logging_out'),
          type: 'error',
          color: 'negative',
          position: 'bottom'
        })

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

        const response = await userAxios.get('/me', {
          headers: { Authorization: `Bearer ${token}` }
        })

        this.user = {
          userId: response.data.userId,
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

    async checkAuthState(router, notify, previousLocale = null, currentLocale = null) {
      // Falls keine Werte übergeben wurden, verwende die aktuelle und gespeicherte Locale
      if (!previousLocale || !currentLocale) {
        previousLocale = i18n.global.locale.value;
        currentLocale = sessionStorage.getItem('selectedLocale') || previousLocale;
      }
    
      console.log("Vorherige Locale:", previousLocale);
      console.log("Aktuelle Locale:", currentLocale);
    
      const token = this.getToken();
      if (token) {
        await this.fetchUser();
      } else {
        this.clearAuthState();
        router.push({ name: 'login', path: '/login' });
    
        // Zeige die neue Benachrichtigung
        const dismissNotification = notify({
          message: i18n.global.t('userNotify.not_logged_in'),
          type: 'warning',
          position: 'bottom',
          timeout: 0 // Dauerhaft anzeigen
        });
    
        // Falls sich die Locale geändert hat, schließe die alte und zeige eine neue
        if (previousLocale !== currentLocale) {
          setTimeout(() => {
            dismissNotification(); // Alte Benachrichtigung schließen
            notify({
              message: i18n.global.t('userNotify.not_logged_in'), // Neue Nachricht in aktualisierter Sprache
              type: 'warning',
              position: 'bottom',
              timeout: 0 // Wieder dauerhaft anzeigen
            });
          }, 10); // Verzögerung für die Aktualisierung
        }
      }
    },

    /* USER STUDY ADDING/REMOVING/UPDATING */
    /************************************************************************************/

    async addStudy(studyId, notify) {
      try {
        const token = this.getToken() // Token über die neue Methode abrufen

        const response = await userAxios.post(
          `/studies/${studyId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        this.user.studies.push(response.data)
        notify({
          message: i18n.global.t('userNotify.study_successfully_added'),
          type: 'success',
          color: 'positive',
          position: 'bottom'
        })
      } catch (error) {
        if (error.response && error.response.status === 400) {
          notify({
            message: i18n.global.t('userNotify.study_already_added'),
            type: 'error',
            color: 'negative',
            position: 'bottom'
          })
          console.error('Fehler beim Hinzufügen des Studiengangs:', error.response.data.message)
          throw new Error(error.response.data.message) // Nachricht vom Backend an das Frontend weiterleiten
        } else {
          notify({
            message: i18n.global.t('userNotify.error_while_adding_study'),
            type: 'error',
            color: 'negative',
            position: 'bottom'
          })
          console.error('Fehler beim Hinzufügen des Studiengangs:', error.message || error)
          throw error // Andere Fehler weitergeben
        }
      }
    },
    async deleteStudies(studyIds, notify) {
      try {
        const token = this.getToken()
        const response = await userAxios.delete(`/studies/delete-studies`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { studyIds } // Sende die Liste von Studiengängen als Anfrage-Daten
        })
        this.user.studies = response.data.studies

        notify({
          message: i18n.global.t('userNotify.study_successfully_removed'),
          type: 'success',
          color: 'positive',
          position: 'bottom'
        })
      } catch (error) {
        notify({
          message: i18n.global.t('userNotify.error_while_removing_study'),
          type: 'error',
          color: 'negative',
          position: 'bottom'
        })

        console.error('Fehler beim Löschen der Studiengänge:', error.message || error)
        throw error
      }
    },
    async updateSubjectStatus(studyId, subjectId, status, grade, shouldNotify = true, notify) {
      try {
        const token = this.getToken()

        const response = await userAxios.patch(
          `/studies/${studyId}/subjects`,
          { studyId, subjectId, status, grade },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        const updatedSubject = response.data.subject

        const study = this.user.studies.find((s) => s.study_id === studyId)
        if (!study) {
          console.error(`Studiengang mit der ID ${studyId} nicht gefunden`)
          return
        }

        const subjectToUpdate = study.subject_states.find((s) => s._id === subjectId)
        if (!subjectToUpdate) {
          console.error(`Fach mit der ID ${subjectId} nicht im Studiengang ${studyId} gefunden`)
          return
        }

        subjectToUpdate.status = updatedSubject.status
        subjectToUpdate.grade = updatedSubject.grade

        console.log(
          `Status des Faches ${subjectToUpdate.name} aktualisiert auf ${updatedSubject.status} und Note ${updatedSubject.grade}`
        )

        // Benachrichtigung nur anzeigen, wenn shouldNotify true ist
        if (shouldNotify) {
          notify({
            message: i18n.global.t('userNotify.course_successfully_updated'),
            type: 'success',
            color: 'positive',
            position: 'bottom'
          })
        }
      } catch (error) {
        if (shouldNotify) {
          notify({
            message: i18n.global.t('userNotify.error_while_updating_course'),
            type: 'error',
            color: 'negative',
            position: 'bottom'
          })
        }
        console.error('Fehler beim Aktualisieren des Faches:', error.message || error)
        throw error
      }
    },
    async updateBulkSubjectStatus(studyId, subjects) {
      try {
        const token = this.getToken() // Token über die neue Methode abrufen
        const response = await userAxios.patch(
          `/studies/${studyId}/subjects/bulk`,
          { studyId, subjects },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
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
            console.error(
              `Fach mit der ID ${updatedSubject._id} nicht im Studiengang ${studyId} gefunden`
            )
            return
          }

          // Aktualisiere den Status des Faches
          subjectToUpdate.status = updatedSubject.status
          subjectToUpdate.grade = updatedSubject.grade
        })
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
    async addSbwlToStudy(studyId, sbwl, notify) {
      try {
        const token = this.getToken()
        const response = await userAxios.post(
          `/studies/${studyId}/sbwls/${sbwl.name}`,
          { studyId, sbwl },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        const study = this.user.studies.find((s) => s.study_id === studyId)
        study.sbwl_states = response.data.sbwl_states
        notify({
          message: i18n.global.t('userNotify.sbwl_successfully_added'),
          type: 'success',
          color: 'positive',
          position: 'bottom'
        })
      } catch (error) {
        notify({
          message: i18n.global.t('userNotify.error_while_adding_sbwl'),
          type: 'error',
          color: 'negative',
          position: 'bottom'
        })

        console.error('Fehler beim Hinzufügen der SBWL:', error)
        throw error
      }
    },
    async addCoursesAbroadToStudy(studyId, coursesAbroad, notify) {
      try {
        const token = this.getToken()
        const response = await userAxios.post(
          `/studies/${studyId}/courses-abroad`,
          { studyId, coursesAbroad },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        const study = this.user.studies.find((s) => s.study_id === studyId)
        study.sbwl_states = response.data.sbwl_states

        notify({
          message: i18n.global.t('userNotify.course_abroad_successfully_added'),
          type: 'success',
          color: 'positive',
          position: 'bottom'
        })
      } catch (error) {
        notify({
          message: i18n.global.t('userNotify.error_while_adding_course_abroad'),
          type: 'error',
          color: 'negative',
          position: 'bottom'
        })

        console.error('Fehler beim Hinzufügen des Auslandssemester Fachs:', error)
        throw error
      }
    },
    async deleteSubjectsFromCourseAbroad(studyId, coursesAbroad, notify) {
      try {
        const token = this.getToken()
        const response = await userAxios.delete(`/studies/${studyId}/courses-abroad`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { studyId, coursesAbroad }
        })
        const study = this.user.studies.find((s) => s.study_id === studyId)
        study.sbwl_states = response.data.sbwl_states

        notify({
          message: i18n.global.t('userNotify.course_abroad_successfully_removed'),
          type: 'success',
          color: 'positive',
          position: 'bottom'
        })
      } catch (error) {
        notify({
          message: i18n.global.t('userNotify.error_while_removing_course_abroad'),
          type: 'error',
          color: 'negative',
          position: 'bottom'
        })

        console.error('Fehler beim Löschen der Auslandssemester:', error)
        throw error
      }
    },
    async deleteSbwlFromStudy(studyId, sbwl, notify) {
      try {
        const token = this.getToken()
        const response = await userAxios.delete(`/studies/${studyId}/sbwls/${sbwl.sbwl_name}`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { studyId, sbwl }
        })
        const study = this.user.studies.find((s) => s.study_id === studyId)
        study.sbwl_states = response.data.sbwl_states
        notify({
          message: i18n.global.t('userNotify.sbwl_successfully_removed'),
          type: 'success',
          color: 'positive',
          position: 'bottom'
        })
      } catch (error) {
        notify({
          message: i18n.global.t('userNotify.error_while_removing_sbwl'),
          type: 'error',
          color: 'negative',
          position: 'bottom'
        })

        console.error('Fehler beim Löschen der SBWL:', error)
        throw error
      }
    },
    async deleteEverySbwlFromStudy(studyId) {
      try {
        const token = this.getToken()
        const response = await userAxios.delete(`/studies/${studyId}/delete-all-sbwls`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const study = this.user.studies.find((s) => s.study_id === studyId)
        study.sbwl_states = response.data.sbwl_states
      } catch (error) {
        console.error('Fehler beim Löschen aller SBWLs:', error)
        throw error
      }
    },
    async updateSbwlSubjectStatus(studyId, subjectId, status, grade, sbwl, notify) {
      try {
        const token = this.getToken()
        const response = await userAxios.patch(
          `/studies/${studyId}/sbwls/${sbwl.sbwl_name}`,
          { studyId, subjectId, status, grade, sbwl },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        const updatedSubject = response.data.subject

        // Suche den Study im Store basierend auf studyId
        const study = this.user.studies.find((s) => s.study_id === studyId)

        if (!study) {
          console.error(`Studiengang mit der ID ${studyId} nicht gefunden`)
          return
        }

        // Suche das Fach (subject) im study.subject_states basierend auf subject._id
        const sbwlToUpdate = study.sbwl_states.find((s) => s.sbwl_name === sbwl.sbwl_name)

        if (sbwlToUpdate) {
          const subjectToUpdate = sbwlToUpdate.subjects.find((subject) => subject._id === subjectId)
          if (subjectToUpdate) {
            // Aktualisiere den Status des Faches
            subjectToUpdate.status = updatedSubject.status
            subjectToUpdate.grade = updatedSubject.grade
            console.log('Subject gefunden:', subjectToUpdate)

            console.log(
              `Status des Faches ${subjectToUpdate.name} aktualisiert auf ${updatedSubject.status} und Note ${updatedSubject.grade}`
            )
          } else {
            console.log('Kein passendes Subject gefunden')
          }
        } else {
        }
        notify({
          message: i18n.global.t('userNotify.course_successfully_updated'),
          type: 'success',
          color: 'positive',
          position: 'bottom'
        })
      } catch (error) {
        notify({
          message: i18n.global.t('userNotify.error_while_updating_course'),
          type: 'error',
          color: 'negative',
          position: 'bottom'
        })

        console.error('Fehler beim Hinzufügen des Studiengangs:', error.message || error)
        throw error // Andere Fehler weitergeben
      }
    },
    /* USER FREE ELECTIVES ADDING/REMOVING/UPDATING */
    /************************************************************************************/

    async addFreeElectiveToStudy(studyId, freeElective, notify) {
      try {
        const token = this.getToken()
        const response = await userAxios.post(
          `/studies/${studyId}/free-electives`,
          { studyId, freeElective },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        const study = this.user.studies.find((s) => s.study_id === studyId)
        study.free_electives = response.data.free_electives
        notify({
          message: i18n.global.t('userNotify.free_elective_successfully_added'),
          type: 'success',
          color: 'positive',
          position: 'bottom'
        })
      } catch (error) {
        notify({
          message: i18n.global.t('userNotify.error_while_adding_free_elective'),
          type: 'error',
          color: 'negative',
          position: 'bottom'
        })

        console.error('Fehler beim Hinzufügen des Wahlfachs:', error)
        throw error
      }
    },
    async deleteFreeElectiveFromStudy(studyId, freeElective, notify) {
      try {
        const token = this.getToken()
        const response = await userAxios.delete(`/studies/${studyId}/free-electives`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { studyId, freeElective }
        })
        const study = this.user.studies.find((s) => s.study_id === studyId)
        study.free_electives = response.data.free_electives
        notify({
          message: i18n.global.t('userNotify.free_elective_successfully_removed'),
          type: 'success',
          color: 'positive',
          position: 'bottom'
        })
      } catch (error) {
        notify({
          message: i18n.global.t('userNotify.error_while_removing_free_elective'),
          type: 'error',
          color: 'negative',
          position: 'bottom'
        })

        console.error('Fehler beim Löschen des Wahlfachs:', error)
        throw error
      }
    },
    async deleteEveryFreeElectiveFromStudy(studyId) {
      try {
        const token = this.getToken()
        const response = await userAxios.delete(`/studies/${studyId}/free-electives/all`, {
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
      try {
        const token = this.getToken()
        course.color = '#5bbdf4' // Setze eine Standardfarbe für den Kurs
        // Füge den Kurs zur Benutzerobjekt hinzu
        this.user.course_entries.push(course)
        console.log('Kurs hinzugefügt:', course)

        // Optional: Sende den Kurs an das Backend zur dauerhaften Speicherung
        await userAxios.post(`/course`, course, {
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
        const response = await userAxios.delete(`/course`, {
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
        await userAxios.patch(
          `/course`,
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
