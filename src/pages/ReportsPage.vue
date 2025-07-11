<template>
  <div class="container py-4">
    <h2 class="mb-4">Informes</h2>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else class="row gy-4">
      <div
        v-for="tipo in tipos"
        :key="tipo.key"
        class="col-md-4"
      >
        <div class="card h-100">
          <div class="card-header">
            {{ tipo.label }}
          </div>
          <div class="card-body d-flex flex-column">
            <!-- Si existe informe -->
            <div v-if="existing[tipo.key]">
              <p>
                <strong>Estado:</strong>
                <span class="text-capitalize">{{ existing[tipo.key]!.estado }}</span>
              </p>
              <p><small>Entregado el {{ formatDate(existing[tipo.key]!.fecha_entrega) }}</small></p>
            </div>
            <!-- Si no existe -->
            <div v-else class="mt-auto">
              <button
                class="btn w-100"
                :class="buttonClass(tipo.key)"
                :disabled="isLocked(tipo.key)"
                @click="goCreate(tipo.key)"
              >
                {{ buttonLabel(tipo.key) }}
              </button>
              <p v-if="pastDeadline(tipo.key)" class="mt-2 text-danger small">
                Se ha pasado la fecha límite ({{ formatDate(deadlines[tipo.key]) }})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getInformes } from '@/services/reportService'; // tu servicio existente
import type { Informe } from '@/types';

// Definición de los tres tipos de informe
const tipos = [
  { key: 'seguimiento1', label: 'Informe de Seguimiento 1' },
  { key: 'seguimiento2', label: 'Informe de Seguimiento 2' },
  { key: 'final',        label: 'Informe Final' }
] as const;

type TipoKey = typeof tipos[number]['key'];

const router = useRouter();
const loading = ref(true);
const informes = ref<Informe[]>([]);

onMounted(async () => {
  informes.value = await getInformes();
  loading.value = false;
});

// Mapeo de informes existentes por tipo
const existing = computed<Record<TipoKey, Informe | undefined>>(() => {
  const map = {} as Record<TipoKey, Informe>;
  for (const inf of informes.value) {
    map[inf.tipo as TipoKey] = inf;
  }
  return map;
});

// Fecha actual
const now = new Date();

// Cálculo de año y cuatrimestre actual
const month = now.getMonth() + 1;
const year  = now.getFullYear();
const semester = month >= 9 || month === 1 ? 1 : 2;

// Definir deadlines con Date nativo
const deadlines: Record<TipoKey, Date> = {
  seguimiento1: new Date(year, semester === 1 ? 9 : 2, semester === 1 ? 31 : 31),
  seguimiento2: new Date(year, semester === 1 ? 10 : 3, semester === 1 ? 30 : 30),
  final:        new Date(year, semester === 1 ? 11 : 4, semester === 1 ? 31 : 31)
};

// Helpers con Date puro
function formatDate(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

function pastDeadline(key: TipoKey): boolean {
  return now.getTime() > deadlines[key].getTime();
}

function canCreate(key: TipoKey): boolean {
  if (existing.value[key]) return false;
  return now.getTime() <= deadlines[key].getTime();
}
function isLocked(key: TipoKey): boolean {
  // Deshabilita el botón solo si es futuro y no se permite crear aún
  return !canCreate(key) && !pastDeadline(key);
}

function buttonLabel(key: TipoKey): string {
  if (existing.value[key]) return 'Informe enviado';
  if (pastDeadline(key)) return 'Se ha pasado la fecha límite';
  if (canCreate(key)) return 'Realizar Informe';
  return 'No disponible todavía';
}

function buttonClass(key: TipoKey): string {
  if (existing.value[key]) return 'btn-success';
  if (pastDeadline(key)) return 'btn-danger';
  if (canCreate(key)) return 'btn-primary';
  return 'btn-secondary';
}

function goCreate(tipo: TipoKey) {
  router.push({ path: '/reports/create', query: { tipo } });
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
}
</style>
