<template>
  <div class="container py-4">
    <h2 class="mb-4">Mi mentor</h2>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="error" class="alert alert-warning">
      No tienes un mentor asignado actualmente.
    </div>

    <table v-else class="table table-striped">
      <thead>
        <tr>
          <th>Mentor</th>
          <th>Mentorizado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="row" :key="row.pairingId">
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
import type { Pairing, User } from '@/types';
import { getPairings } from '@/services/pairingService';
import { getUsuarioById } from '@/services/userService';

interface Row {
  pairingId: number;
  mentor: User;
  mentorizado: User;
}

const loading = ref(true);
const error = ref(false);
const row = ref<Row | null>(null);

onMounted(async () => {
  try {
    const pairings: Pairing[] = await getPairings();
    if (pairings.length === 0) throw new Error('Sin emparejamientos');
    const p = pairings[0]; // sólo uno para el mentorizado
    const [mentor, mentorizado] = await Promise.all([
      getUsuarioById(p.mentor),
      getUsuarioById(p.mentorizado)
    ]);
    row.value = { pairingId: p.id, mentor, mentorizado };
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
});
</script>
