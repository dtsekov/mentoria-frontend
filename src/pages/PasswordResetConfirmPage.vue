<!-- src/pages/PasswordResetConfirm.vue -->
<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
      <h2 class="mb-4 text-center">Nueva contraseña</h2>

      <form @submit.prevent="onSubmit" v-if="!resetComplete">
        <div class="mb-3">
          <label for="password" class="form-label">Nueva contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            id="password" 
            class="form-control" 
            required 
            minlength="8"
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div class="mb-3">
          <label for="passwordConfirm" class="form-label">Confirmar contraseña</label>
          <input 
            v-model="passwordConfirm" 
            type="password" 
            id="passwordConfirm" 
            class="form-control" 
            required 
            minlength="8"
            placeholder="Repite la contraseña"
          />
        </div>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <button 
          type="submit" 
          class="btn btn-primary w-100 d-flex justify-content-center align-items-center" 
          :disabled="loading || !isFormValid" 
          style="height: 40px;"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          <span>Cambiar contraseña</span>
        </button>
      </form>

      <div v-if="!token" class="text-center">
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          Token de restablecimiento no válido o expirado.
        </div>
        <router-link to="/login" class="btn btn-primary">
          Volver al inicio de sesión
        </router-link>
      </div>
    </div>

    <!-- Toast de éxito -->
    <div 
      v-if="showSuccessToast" 
      class="toast-container position-fixed top-0 end-0 p-3"
      style="z-index: 1060;"
    >
      <div class="toast show" role="alert">
        <div class="toast-header bg-success text-white">
          <i class="bi bi-check-circle-fill me-2"></i>
          <strong class="me-auto">¡Éxito!</strong>
          <button 
            type="button" 
            class="btn-close btn-close-white" 
            @click="showSuccessToast = false"
          ></button>
        </div>
        <div class="toast-body">
          Se ha actualizado con éxito. Vuelve a logearte.
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { passwordResetService } from '@/services/passwordResetService';

onMounted(() => {
  document.body.style.backgroundImage = "url('/img/Cafeteria.jpg')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
});

onUnmounted(() => {
  // Limpiar estilos al salir de la página
  document.body.style.backgroundImage = '';
  document.body.style.backgroundSize = '';
  document.body.style.backgroundPosition = '';
  document.body.style.backgroundRepeat = '';
});

const route = useRoute();
const router = useRouter();

const token = ref(route.query.token as string);
const password = ref('');
const passwordConfirm = ref('');
const error = ref<string | null>(null);
const loading = ref(false);
const resetComplete = ref(false);
const showSuccessToast = ref(false);

const isFormValid = computed(() => {
  return password.value.length >= 8 && 
         passwordConfirm.value.length >= 8 && 
         password.value === passwordConfirm.value;
});

async function onSubmit() {
  error.value = null;
  
  if (password.value !== passwordConfirm.value) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }

  if (password.value.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres';
    return;
  }

  loading.value = true;
  
  try {
    await passwordResetService.confirmReset(token.value, password.value);
    
    resetComplete.value = true;
    showSuccessToast.value = true;
    
    // Redirigir al login después de 3 segundos
    setTimeout(() => {
      router.push('/login');
    }, 3000);
    
  } catch (err: any) {
    error.value = err.response?.data?.password?.[0] || 
                 err.response?.data?.token?.[0] || 
                 err.response?.data?.detail || 
                 'Error al restablecer la contraseña. Verifica que el enlace sea válido.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.vh-100 {
  height: 100vh;
}

.toast-container {
  z-index: 1060;
}

.toast.show {
  display: block;
}

.form-control:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.btn:disabled {
  opacity: 0.65;
}
</style>