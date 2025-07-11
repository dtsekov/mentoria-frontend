<template>
  <div class="container py-4">
    <h2 class="mb-4">
      {{ profileTitle }}
      <small v-if="!hasPermission" class="text-danger">(Sin permisos)</small>
    </h2>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="!hasPermission" class="alert alert-warning">
      No tienes permiso para ver este perfil.
    </div>

    <form v-else-if="user" @submit.prevent="onSubmit" novalidate>
      <!-- Email readonly -->
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input
          :value="form.email"
          type="email"
          class="form-control"
          readonly
        />
      </div>

      <!-- Nombre completo -->
      <div class="mb-3">
        <label class="form-label">Nombre completo</label>
        <input
          v-model="form.nombre"
          type="text"
          class="form-control"
          :readonly="!isOwnProfile"
          required
        />
      </div>

      <!-- Teléfono -->
      <div class="mb-3">
        <label class="form-label">Teléfono</label>
        <input
          v-model="form.phone_number"
          type="tel"
          class="form-control"
          :readonly="!isOwnProfile"
        />
      </div>

      <!-- Rol actual (readonly) -->
      <div class="mb-3">
        <label class="form-label">Rol actual</label>
        <input
          :value="user.rol_actual"
          type="text"
          class="form-control"
          readonly
        />
      </div>

      <!-- Botón Guardar sólo para tu propio perfil -->
      <button
        v-if="isOwnProfile"
        type="submit"
        class="btn btn-primary"
        :disabled="saving"
      >
        <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
        Guardar cambios
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { getUsuarioById, patchUsuario } from '@/services/userService';
import type { User } from '@/types';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const loading = ref(true);
const saving = ref(false);
const hasPermission = ref(true);
const user = ref<User | null>(null);

// Determinar a quién vemos
const targetId = computed(() => {
  const param = route.params.id;
  return param ? Number(param) : auth.userId!;
});
const isOwnProfile = computed(() => targetId.value === auth.userId);

// Título dinámico
const profileTitle = computed(() => {
  if (!user.value) return 'Perfil de usuario';
  if (isOwnProfile.value) return `Perfil mío`;
  if (auth.rol === 'mentor') return `Perfil de mi mentorizado`;
  if (auth.rol === 'mentorizado') return `Perfil de mi mentor`;
  return `Perfil del usuario`;
});

// Formulario
const form = reactive({
  email: '',
  nombre: '',
  phone_number: ''
});

onMounted(async () => {
  try {
    const u = await getUsuarioById(targetId.value);
    user.value = u;
    form.email = u.email;
    form.nombre = u.nombre;
    form.phone_number = u.phone_number;
  } catch (err: any) {
    if (err.response?.status === 403) {
      hasPermission.value = false;
    }
  } finally {
    loading.value = false;
  }
});

async function onSubmit() {
  if (!user.value) return;
  saving.value = true;
  try {
    const updated = await patchUsuario(targetId.value, {
      nombre: form.nombre,
      phone_number: form.phone_number
    });
    user.value = updated;
    alert('Perfil actualizado correctamente.');
  } catch (err: any) {
    alert('Error al guardar: ' + (err.response?.data?.detail || err.message));
  } finally {
    saving.value = false;
  }
}
</script>
