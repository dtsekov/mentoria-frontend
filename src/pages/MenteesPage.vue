<template>
  <div class="container py-4">
    <h2 class="mb-4">Mis mentorizados</h2>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="error" class="alert alert-warning">
      No tienes emparejamientos activos.
    </div>

    <table v-else class="table table-striped">
      <thead>
        <tr>
          <th>Mentor</th>
          <th>Mentorizado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.pairingId">
          <td>
            <router-link :to="`/profile/${row.mentor.id}`">
              {{ row.mentor.nombre }}
            </router-link>
          </td>
          <td>
            <router-link :to="`/profile/${row.mentorizado.id}`">
              {{ row.mentorizado.nombre }}
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import type { User, Pairing } from '@/types';
import { getPairings } from '@/services/pairingService';
import { getUsuarioById } from '@/services/userService';
import { useAuthStore } from '@/store/authStore';

interface Row {
  pairingId: number;
  mentor: User;
  mentorizado: User;
}

const auth = useAuthStore();
const loading = ref(true);
const error = ref(false);
const rows = ref<Row[]>([]);

onMounted(async () => {
  try {
    const pairings = await getPairings();
    if (pairings.length === 0) throw new Error('Sin emparejamientos');

    // Para cada pairing, traemos ambos usuarios
    const promises = pairings.map(async (p: Pairing) => {
      const [mentor, mentorizado] = await Promise.all([
        getUsuarioById(p.mentor),
        getUsuarioById(p.mentorizado)
      ]);
      return {
        pairingId: p.id,
        mentor,
        mentorizado
      };
    });

    rows.value = await Promise.all(promises);
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
});
</script>
