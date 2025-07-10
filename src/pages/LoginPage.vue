<!-- src/pages/LoginPage.vue -->
<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
      <h2 class="mb-4 text-center">Iniciar sesión</h2>

      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input v-model="email" type="email" id="email" class="form-control" required />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input v-model="password" type="password" id="password" class="form-control" required />
        </div>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"> Entrando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

const email = ref('');
const password = ref('');
const error = ref<string | null>(null);
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

async function onSubmit() {
  error.value = null;
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
    const redirect = (route.query.redirect as string) || '/';
    router.replace(redirect);
  } catch (err: any) {
    error.value =
      err.response?.data?.detail || err.message || 'Error al iniciar sesión';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.vh-100 {
  height: 100vh;
}
</style>
