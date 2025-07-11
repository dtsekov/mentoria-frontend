<!-- src/views/ProgressPage.vue -->
<template>
  <div class="container py-4">
    <h2 class="mb-4">Progreso de Informes</h2>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="informes.length === 0" class="alert alert-info">
      No existen informes en el cuatrimestre actual.
    </div>

    <div v-else class="row text-center gx-4 gy-4">
      <div
        v-for="tipo in tipos"
        :key="tipo.key"
        class="col-12 col-md-4"
      >
        <div
          class="card h-100 p-3"
          @click="goDetail(tipo.key)"
          style="cursor: pointer;"
        >
          <div class="card-body d-flex flex-column justify-content-center align-items-center">
            <i :class="iconFor(tipo.key)" class="fs-1 mb-2"></i>
            <h5>{{ tipo.label }}</h5>
            <small v-if="existing[tipo.key]" class="text-muted">
              Entregado: {{ formatDate(existing[tipo.key]!.fecha_entrega) }}
            </small>
            <div v-else class="mt-2 text-secondary">— No entregado —</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Informe } from '@/types';
import { getInformes } from '@/services/reportService';

// Definición de tipos y labels
const tipos = [
  { key: 'seguimiento1', label: 'Seguimiento 1' },
  { key: 'seguimiento2', label: 'Seguimiento 2' },
  { key: 'final',        label: 'Final' }
] as const;
type TipoKey = typeof tipos[number]['key'];

const router = useRouter();
const loading = ref(true);
const informes = ref<Informe[]>([]);

// Cargar informes
onMounted(async () => {
  informes.value = await getInformes();
  loading.value = false;
});

// Mapear informes existentes por tipo
const existing = computed<Record<TipoKey, Informe | undefined>>(() => {
  const map = {} as Record<TipoKey, Informe>;
  for (const inf of informes.value) {
    map[inf.tipo as TipoKey] = inf;
  }
  return map;
});

// Iconos según estado
function iconFor(key: TipoKey): string {
  const inf = existing.value[key];
  if (!inf) return 'fa fa-circle text-secondary';
  switch (inf.estado) {
    case 'pendiente': return 'fa fa-clock text-warning';
    case 'aprobado':  return 'fa fa-check-circle text-success';
    case 'devuelto':  return 'fa fa-times-circle text-danger';
    default:          return 'fa fa-question-circle text-muted';
  }
}

// Formato de fecha
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

// Navegar al detalle de informe o a creación si no existe
function goDetail(key: TipoKey) {
  const inf = existing.value[key];
  if (inf) {
    // Usar path directo en lugar de name/params
    router.push(`/reports/${inf.id}`);
  } else {
    router.push({ name: 'ReportCreate', query: { tipo: key } });
  }
}
</script>

<style scoped>
.card {
  transition: transform 0.1s ease;
}
.card:hover {
  transform: translateY(-4px);
}
</style>
