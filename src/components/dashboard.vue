<template>
  <div>
    <h1>Dashboard</h1>
    <p>Willkommen! Sie sind eingeloggt.</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
};
</script>
