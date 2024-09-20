import { defineStore } from 'pinia';
import axios from 'axios';

const apiUrl = 'http://localhost:5000/api/auth';

export const useUserStore = defineStore('user', {
  state: () => ({
    loggedIn: false,
    user: {
      email: '',
      name: '', // Hier auch den Namen initialisieren
    },
  }),

  actions: {
    async login(email, password, router) { // Router als Argument hinzufügen
      try {
        const response = await axios.post(`${apiUrl}/login`, { email, password });

        // Überprüfe die Struktur des Response
        console.log(response.data); // Füge diese Zeile hinzu, um die Response zu sehen

        // Speichere den Token in localStorage
        localStorage.setItem('token', response.data.token);

        // Setze den Benutzer als eingeloggt und speichere die Daten
        this.loggedIn = true;
        this.user = {
          email: response.data.email, // Hier auf response.data.email zugreifen
          name: '', // Name bleibt leer, da er nicht vom Backend kommt
        };

        // Weiterleitung zur Dashboard-Seite oder einer anderen Seite
        router.push({ name: 'home', path: '/' }); // Router verwenden
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

        // Authentifizierungs-Header setzen
        const response = await axios.get(`${apiUrl}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Benutzerdaten setzen
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

    async logout() {
      try {
        // Optional: Server-Seite über Logout informieren
        await axios.post(`${apiUrl}/logout`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        this.clearAuthState();
        window.location.href = '/'; // Leite den Benutzer zur Startseite
      } catch (error) {
        console.error('Logout-Fehler: ', error);
        this.clearAuthState();
      }
    },

    clearAuthState() {
      this.loggedIn = false;
      this.user = { email: '', name: '' };

      // Entferne Token aus localStorage
      localStorage.removeItem('token');
    },
  },
});
