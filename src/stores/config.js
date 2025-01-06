// config.js
import axios from 'axios';

// Umgebungsabhängige Konfiguration
const isLocalhost = window.location.hostname === 'localhost';

// Basis-URLs
const config = {
  authApi: isLocalhost ? 'http://localhost:5000/api/auth' : 'https://taigowiz.org/api/auth',
  userApi: isLocalhost ? 'http://localhost:5000/api/user' : 'https://taigowiz.org/api/user',
  profApi: isLocalhost ? 'http://localhost:5001/api/profs' : 'https://taigowiz.org/api/profs',
  adminApi: isLocalhost ? 'http://localhost:5000/api/admin' : 'https://taigowiz.org/api/admin',
  lvApi: isLocalhost ? 'http://localhost:5000/api/user/lv' : 'https://taigowiz.org/api/user/lv',
};

// Globale Axios-Instanzen
export const authAxios = axios.create({
  baseURL: config.authApi,
});

export const userAxios = axios.create({
  baseURL: config.userApi,
});

export const profAxios = axios.create({
  baseURL: config.profApi,
});

export const adminAxios = axios.create({
  baseURL: config.adminApi,
});

export const lvAxios = axios.create({
  baseURL: config.lvApi,
});

// Token-Interceptor (optional, falls global erforderlich)
export function setAuthToken(token) {
  [authAxios, userAxios, profAxios, adminAxios, lvAxios].forEach((instance) => {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  });
}
export function getOAuthUrl() {
    const root_url = "https://oauth.oeh-wu.at/authorize";
  
    const options = {
      redirect_uri: "http://localhost:5000/api/auth/oauth/callback", // Passe an deine Backend-URL an
      client_id: "profcheck-dev",
      response_type: "code",
      prompt: "consent",
      scope: "basic, study",
      state: "/", // Optional: kann genutzt werden, um Statusdaten zu übertragen
    };
  
    const qs = new URLSearchParams(options);
    return `${root_url}?${qs}`;
  }


export default config;