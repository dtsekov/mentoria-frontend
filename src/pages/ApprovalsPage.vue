<!-- src/views/ApprovalsPage.vue -->
<template>
  <div class="container py-4">
    <h2 class="mb-4">Aprobaciones de Informes</h2>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="grouped.length === 0" class="alert alert-info">
      No hay informes que aprobar en este cuatrimestre.
    </div>

    <div v-else>
      <div
        v-for="group in grouped"
        :key="group.user.id"
        class="mb-5"
      >
        <h4>{{ group.user.nombre }}</h4>
        <ul class="list-group">
          <li
            v-for="inf in group.informes"
            :key="inf.id"
            class="list-group-item d-flex justify-content-between align-items-center"
            @click="goDetail(inf.id)"
            style="cursor: pointer;"
          >
            <span class="text-capitalize">{{ labelFor(inf.tipo) }}</span>
            <i :class="iconFor(inf.estado)"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getInformes } from '@/services/reportService';
import { getUsuarioById } from '@/services/userService';
import type { Informe, User } from '@/types';

const router = useRouter();
const loading = ref(true);
const informes = ref<Informe[]>([]);
const usersMap = ref<Record<number, User>>({});

onMounted(async () => {
  // 1. Cargar informes
  informes.value = await getInformes();

  // 2. Obtener IDs únicos de usuarios
  const userIds = Array.from(new Set(informes.value.map(i => i.user)));

  // 3. Cargar datos de cada usuario
  const users = await Promise.all(
    userIds.map(id => getUsuarioById(id).catch(() => null))
  );
  users.forEach(u => {
    if (u) usersMap.value[u.id] = u;
  });

  loading.value = false;
});

// Agrupar informes por usuario, ordenando por nombre de usuario
const grouped = computed(() => {
  // crear mapa de id -> lista de informes
  const map = {} as Record<number, Informe[]>;
  for (const inf of informes.value) {
    if (!map[inf.user]) map[inf.user] = [];
    map[inf.user].push(inf);
  }
  // transformar en array
  return Object.entries(map)
    .map(([userId, infs]) => {
      const u = usersMap.value[Number(userId)];
      return { user: u, informes: infs };
    })
    .filter(g => g.user) // quitar potenciales nulos
    .sort((a, b) => a.user.nombre.localeCompare(b.user.nombre));
});

// Iconos según estado
function iconFor(estado: Informe['estado']): string {
  switch (estado) {
    case 'pendiente': return 'fa fa-clock text-warning';
    case 'aprobado':  return 'fa fa-check-circle text-success';
    case 'devuelto':  return 'fa fa-times-circle text-danger';
    default:          return 'fa fa-question-circle text-muted';
  }
}

// Etiqueta legible para tipo
function labelFor(tipo: Informe['tipo']): string {
  switch (tipo) {
    case 'seguimiento1': return 'Seguimiento 1';
    case 'seguimiento2': return 'Seguimiento 2';
    case 'final':        return 'Final';
    default:             return tipo;
  }
}

// Navegar a detalle
function goDetail(id: number) {
  router.push(`/reports/${id}`);
}
</script>

<style scoped>
.list-group-item:hover {
  background-color: #f8f9fa;
}
</style>
