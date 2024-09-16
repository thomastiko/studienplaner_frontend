<template>
  <div>
    <h1>Registrieren</h1>
    <form @submit.prevent="register">
      <div>
        <label for="email">E-Mail:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Passwort:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Registrieren</button>
    </form>
    <p>Bereits registriert? <router-link to="/login">Login</router-link></p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          email: this.email,
          password: this.password
        });
        localStorage.setItem('token', response.data.token);
        this.$router.push('/dashboard');
      } catch (error) {
        console.error(error);
        alert('Fehler bei der Registrierung');
      }
    }
  }
};
</script>
