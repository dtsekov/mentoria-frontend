<!-- src/pages/LoginPage.vue -->
<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
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

        <button type="submit" class="btn btn-primary w-100 d-flex justify-content-center align-items-center" :disabled="loading" style="height: 40px;">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-else>Entrar</span>
        </button>
      </form>

      <!-- Links para abrir modales -->
      <div class="text-center mt-3">
        <button type="button" class="btn btn-link p-0 text-decoration-none" @click="showResetModal = true">
          ¿Olvidaste tu contraseña?
        </button>
      </div>
      
      <div class="text-center mt-2">
        <button type="button" class="btn btn-link p-0 text-decoration-none" @click="showRegisterModal = true">
          ¿No tienes cuenta? Registrarse
        </button>
      </div>
    </div>

    <!-- Modal de Reset Password -->
    <div v-if="showResetModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Restablecer contraseña</h5>
            <button type="button" class="btn-close" @click="closeResetModal"></button>
          </div>
          <div class="modal-body">
            <p class="text-muted">Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.</p>
            
            <form @submit.prevent="onResetPassword">
              <div class="mb-3">
                <label for="resetEmail" class="form-label">Email</label>
                <input v-model="resetEmail" type="email" id="resetEmail" class="form-control" required />
              </div>

              <div v-if="resetError" class="alert alert-danger">{{ resetError }}</div>
              <div v-if="resetSuccess" class="alert alert-success">{{ resetSuccess }}</div>

              <div class="d-flex gap-2">
                <button type="button" class="btn btn-secondary flex-fill" @click="closeResetModal">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary flex-fill d-flex justify-content-center align-items-center" :disabled="resetLoading">
                  <span v-if="resetLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <span>Enviar enlace</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Registro -->
    <div v-if="showRegisterModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Registrarse</h5>
            <button type="button" class="btn-close" @click="closeRegisterModal"></button>
          </div>
          <div class="modal-body">
            <p class="text-muted">Crea una cuenta nueva. Debes usar un email de la UPM (@alumnos.upm.es o @upm.es)</p>
            
            <form @submit.prevent="onRegister">
              <div class="mb-3">
                <label for="registerEmail" class="form-label">Email</label>
                <input 
                  v-model="registerEmail" 
                  type="email" 
                  id="registerEmail" 
                  class="form-control" 
                  :class="{ 'is-invalid': registerEmailError }"
                  required 
                />
                <div v-if="registerEmailError" class="invalid-feedback">
                  {{ registerEmailError }}
                </div>
              </div>

              <div class="mb-3">
                <label for="registerPassword" class="form-label">Contraseña</label>
                <input 
                  v-model="registerPassword" 
                  type="password" 
                  id="registerPassword" 
                  class="form-control" 
                  :class="{ 'is-invalid': registerPasswordError }"
                  required 
                />
                <div class="form-text text-muted small">
                  Mínimo 8 caracteres, una mayúscula, una minúscula y un carácter especial
                </div>
                <div v-if="registerPasswordError" class="invalid-feedback">
                  {{ registerPasswordError }}
                </div>
              </div>

              <div class="mb-3">
                <label for="registerPasswordConfirm" class="form-label">Confirmar contraseña</label>
                <input 
                  v-model="registerPasswordConfirm" 
                  type="password" 
                  id="registerPasswordConfirm" 
                  class="form-control" 
                  :class="{ 'is-invalid': registerPasswordConfirmError }"
                  required 
                />
                <div v-if="registerPasswordConfirmError" class="invalid-feedback">
                  {{ registerPasswordConfirmError }}
                </div>
              </div>

              <div v-if="registerError" class="alert alert-danger">{{ registerError }}</div>

              <div class="d-flex gap-2">
                <button type="button" class="btn btn-secondary flex-fill" @click="closeRegisterModal">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary flex-fill d-flex justify-content-center align-items-center" :disabled="registerLoading">
                  <span v-if="registerLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <span>Registrarse</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast de éxito -->
    <div v-if="showSuccessToast" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1060;">
      <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header bg-success text-white">
          <strong class="me-auto">¡Éxito!</strong>
          <button type="button" class="btn-close btn-close-white" @click="showSuccessToast = false"></button>
        </div>
        <div class="toast-body">
          {{ successMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { onMounted, onUnmounted } from 'vue';
import { passwordResetService } from '@/services/passwordResetService';
import { postUsuario } from '@/services/userService';

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

// Variables para login
const email = ref('');
const password = ref('');
const error = ref<string | null>(null);
const loading = ref(false);

// Variables para reset password
const showResetModal = ref(false);
const resetEmail = ref('');
const resetError = ref<string | null>(null);
const resetSuccess = ref<string | null>(null);
const resetLoading = ref(false);

// Variables para registro
const showRegisterModal = ref(false);
const registerEmail = ref('');
const registerPassword = ref('');
const registerPasswordConfirm = ref('');
const registerError = ref<string | null>(null);
const registerLoading = ref(false);

// Variables para toast
const showSuccessToast = ref(false);
const successMessage = ref('');

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

// Validaciones para registro
const registerEmailError = computed(() => {
  if (!registerEmail.value) return null;
  
  const emailRegex = /^[^\s@]+@(alumnos\.upm\.es|upm\.es)$/;
  if (!emailRegex.test(registerEmail.value)) {
    return 'El email debe ser de la UPM (@alumnos.upm.es o @upm.es)';
  }
  return null;
});

const registerPasswordError = computed(() => {
  if (!registerPassword.value) return null;
  
  const password = registerPassword.value;
  
  // Validar longitud mínima
  if (password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres';
  }
  
  // Validar mayúscula
  if (!/[A-Z]/.test(password)) {
    return 'La contraseña debe tener al menos una letra mayúscula';
  }
  
  // Validar minúscula
  if (!/[a-z]/.test(password)) {
    return 'La contraseña debe tener al menos una letra minúscula';
  }
  
  // Validar carácter especial
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'La contraseña debe tener al menos un carácter especial (!@#$%^&*(),.?":{}|<>)';
  }
  
  return null;
});

const registerPasswordConfirmError = computed(() => {
  if (!registerPasswordConfirm.value) return null;
  
  if (registerPassword.value !== registerPasswordConfirm.value) {
    return 'Las contraseñas no coinciden';
  }
  return null;
});

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

async function onResetPassword() {
  resetError.value = null;
  resetSuccess.value = null;
  resetLoading.value = true;
  
  try {
    await passwordResetService.requestReset(resetEmail.value);
    
    resetSuccess.value = 'Se ha enviado un enlace de restablecimiento a tu email.';
    resetEmail.value = '';
    
    // Opcional: cerrar el modal después de un tiempo
    setTimeout(() => {
      closeResetModal();
    }, 3000);
    
  } catch (err: any) {
    resetError.value = err.response?.data?.email?.[0] || 
                     err.response?.data?.detail || 
                     'Error al enviar el enlace de restablecimiento';
  } finally {
    resetLoading.value = false;
  }
}

async function onRegister() {
  // Validar antes de enviar
  if (registerEmailError.value || registerPasswordError.value || registerPasswordConfirmError.value) {
    return;
  }

  registerError.value = null;
  registerLoading.value = true;
  
  try {
    await postUsuario({
      email: registerEmail.value,
      password: registerPassword.value
    });
    
    // Mostrar toast de éxito
    successMessage.value = 'Registrado con éxito. Ya puede loguearse.';
    showSuccessToast.value = true;
    
    // Cerrar modal y limpiar formulario
    closeRegisterModal();
    
    // Ocultar toast después de 5 segundos
    setTimeout(() => {
      showSuccessToast.value = false;
    }, 5000);
    
  } catch (err: any) {
    registerError.value = err.response?.data?.email?.[0] || 
                         err.response?.data?.detail || 
                         'Error al registrar el usuario';
  } finally {
    registerLoading.value = false;
  }
}

function closeResetModal() {
  showResetModal.value = false;
  resetEmail.value = '';
  resetError.value = null;
  resetSuccess.value = null;
}

function closeRegisterModal() {
  showRegisterModal.value = false;
  registerEmail.value = '';
  registerPassword.value = '';
  registerPasswordConfirm.value = '';
  registerError.value = null;
}
</script>

<style scoped>
.vh-100 {
  height: 100vh;
}

.login-background {
  background-image: url('/img/Cafeteria.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.modal.show {
  display: block;
}

.btn-link {
  color: #6c757d;
  font-size: 0.875rem;
}

.btn-link:hover {
  color: #495057;
}

.toast-container {
  z-index: 1060;
}

.toast {
  min-width: 300px;
}
</style>