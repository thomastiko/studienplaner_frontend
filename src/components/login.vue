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
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Importiere useRouter
import { useUserStore } from '@/stores/user.store'; // Importiere den Store
import { useQuasar } from 'quasar'; // Importiere Quasar

export default {
  setup() {
    const router = useRouter(); // Hole den Router
    const userStore = useUserStore();
    const q = useQuasar();

    const email = ref('');
    const password = ref('');
    const error = ref('');

    const login = async () => {
      try {
        await userStore.login(email.value, password.value, router, q.notify); // Router übergeben
      } catch (err) {
        error.value = 'Fehler bei der Anmeldung: ' + (err.response?.data?.message || 'Unbekannter Fehler');
        console.error(err);
      }
    };

    return {
      email,
      password,
      error,
      login,
    };
  },
};
</script>
