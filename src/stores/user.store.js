import { defineStore } from 'pinia';
import axios from 'axios';

const apiUrl = 'http://localhost:5000/api/auth';
const url = 'http://localhost:5000/api/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    loggedIn: false,
    user: {
      email: '',
      student_id: '',
      role: '',
      studies: [], // Studiengänge werden hier gespeichert
      course_entries: [] // Kursbelegungen
    },
  }),

  actions: {
    getToken() {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }
      return token;
    },
    async login(email, password, router) {
      try {
        const response = await axios.post(`${apiUrl}/login`, { email, password });

        localStorage.setItem('token', response.data.token);

        this.loggedIn = true;
        this.user = {
          email: response.data.email,
          student_id: response.data.student_id,
          role: response.data.role,
          studies: response.data.studies,
          course_entries: response.data.course_entries,
        };

        router.push({ name: 'my-study', path: '/my-study' });
      } catch (error) {
        console.error('Login-Fehler: ', error.response?.data?.message || error.message);
        throw error;
      }
    },

    async fetchUser(router) {
      try {
        const token = this.getToken();
        if (!token) {
          this.clearAuthState();
          router.push({ name: 'login', path: '/login' });
          return;
        }

        const response = await axios.get(`${url}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.user = {
          email: response.data.email,
          student_id: response.data.student_id,
          role: response.data.role,
          studies: response.data.studies,
          course_entries: response.data.course_entries,
        };
        this.loggedIn = true;
      } catch (error) {
        console.error('Fehler beim Abrufen der Benutzerdaten: ', error);
        this.clearAuthState();
      }
    },

    async checkAuthState(router) {
      const token = this.getToken();
      if (token) {
        await this.fetchUser();
      } else {
        this.clearAuthState();
        router.push({ name: 'login', path: '/login' });
      }
    },
    async addStudy(studyId) {
      try {
        const token = this.getToken();  // Token über die neue Methode abrufen
    
        const response = await axios.post(`${url}/studies/${studyId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
    
        this.user.studies.push(response.data);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.error("Fehler beim Hinzufügen des Studiengangs:", error.response.data.message);
          throw new Error(error.response.data.message); // Nachricht vom Backend an das Frontend weiterleiten
        } else {
          console.error("Fehler beim Hinzufügen des Studiengangs:", error.message || error);
          throw error; // Andere Fehler weitergeben
        }
      }
    },
    
    async logout(router) {
      try {
        await axios.post(`${apiUrl}/logout`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        this.clearAuthState();
        router.push({ name: 'login', path: '/login' });
      } catch (error) {
        console.error('Logout-Fehler: ', error);
        this.clearAuthState();
      }
    },

    clearAuthState() {
      this.loggedIn = false;
      this.user = { email: '', student_id: '', role: '', studies: [], course_entries: [] };
      localStorage.removeItem('token');
    },
  },
});
