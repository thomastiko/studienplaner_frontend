import { defineStore } from 'pinia';
import axios from 'axios';

const apiUrl = 'http://localhost:5000/api/auth';

export const useUserStore = defineStore('user', {
  state: () => ({
    loggedIn: false,
    user: {
      email: '',
    },
  }),

  actions: {
    async login(email, password, router) {
      try {
        const response = await axios.post(`${apiUrl}/login`, { email, password });

        localStorage.setItem('token', response.data.token);

        this.loggedIn = true;
        this.user = {
          email: response.data.email,
        };

        router.push({ name: 'my-study', path: '/my-study' });
      } catch (error) {
        console.error('Login-Fehler: ', error.response?.data?.message || error.message);
        throw error;
      }
    },

    async fetchUser() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.clearAuthState();
          return;
        }

        const response = await axios.get(`${apiUrl}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.user = {
          email: response.data.email,
          name: response.data.name,
        };
        this.loggedIn = true;
      } catch (error) {
        console.error('Fehler beim Abrufen der Benutzerdaten: ', error);
        this.clearAuthState();
      }
    },

    async checkAuthState() {
      const token = localStorage.getItem('token');
      if (token) {
        await this.fetchUser();
      } else {
        this.clearAuthState();
      }
    },

    async logout(router) {
      try {
        await axios.post(`${apiUrl}/logout`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        this.clearAuthState();
        router.push({ name: 'login', path: '/login' })
      } catch (error) {
        console.error('Logout-Fehler: ', error);
        this.clearAuthState();
      }
    },

    clearAuthState() {
      this.loggedIn = false;
      this.user = { email: '', name: '' };
      localStorage.removeItem('token');
    },
  },
});
