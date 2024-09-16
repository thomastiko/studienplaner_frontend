<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="E-Mail" required />
      <input v-model="password" type="password" placeholder="Passwort" required />
      <button type="submit">Login</button>
      <p v-if="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: this.email,
          password: this.password
        });

        localStorage.setItem('token', response.data.token);
        this.$router.push('/dashboard');
      } catch (error) {
        this.error = 'Fehler bei der Anmeldung: ' + (error.response?.data?.message || 'Unbekannter Fehler');
        console.error(error);
      }
    }
  }
};
</script>
