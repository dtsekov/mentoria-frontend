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
            <!-- Si existe informe y NO es devuelto -->
            <div v-if="hasReport(tipo.key) && existing[tipo.key]!.estado !== 'devuelto'">
              <p><strong>Estado:</strong> <span class="text-capitalize">{{ existing[tipo.key]!.estado }}</span></p>
              <p><small>Entregado el {{ formatDate(existing[tipo.key]!.fecha_entrega) }}</small></p>
            </div>

            <!-- Si existe informe y ES devuelto: permitir recrear -->
            <div v-else-if="hasReport(tipo.key) && existing[tipo.key]!.estado === 'devuelto'" class="mt-auto">
              <p><strong class="text-danger">Rechazado</strong></p>
              <button
                class="btn btn-danger w-100"
                @click="goCreate(tipo.key)"
              >
                Rehacer Informe
              </button>
            </div>

            <!-- Si no existe informe -->
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
import { getInformes } from '@/services/reportService';
import type { Informe } from '@/types';

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

// Mapear por tipo
const existing = computed<Record<TipoKey, Informe | undefined>>(() => {
  const map = {} as Record<TipoKey, Informe>;
  for (const inf of informes.value) {
    map[inf.tipo as TipoKey] = inf;
  }
  return map;
});

// Helpers
const now = new Date();
const month = now.getMonth() + 1;
const year  = now.getFullYear();
const semester = month >= 9 || month === 1 ? 1 : 2;
const deadlines: Record<TipoKey, Date> = {
  seguimiento1: new Date(year, semester === 1 ? 9 : 2, semester === 1 ? 31 : 31),
  seguimiento2: new Date(year, semester === 1 ? 10 : 3, semester === 1 ? 30 : 30),
  final:        new Date(year, semester === 1 ? 11 : 4, semester === 1 ? 31 : 31)
};

function formatDate(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

function pastDeadline(key: TipoKey): boolean {
  return now.getTime() > deadlines[key].getTime();
}

function hasReport(key: TipoKey): boolean {
  return !!existing.value[key];
}

// Sólo bloqueamos cuando NO es devuelto y no está en ventana
function isLocked(key: TipoKey): boolean {
  // Si existe y estado != devuelto, bloqueado
  if (hasReport(key) && existing.value[key]!.estado !== 'devuelto') return true;
  // Si no existe y aún no toca crear
  return !pastDeadline(key) && now.getTime() > deadlines[key].getTime() === false ? false : false;
}

function canCreate(key: TipoKey): boolean {
  // Permitimos crear si no existe o si fue devuelto
  if (!hasReport(key)) return now.getTime() <= deadlines[key].getTime();
  return existing.value[key]!.estado === 'devuelto';
}

function buttonLabel(key: TipoKey): string {
  if (!hasReport(key)) {
    if (pastDeadline(key)) return 'Se ha pasado la fecha límite';
    return 'Realizar Informe';
  }
  return '';
}

function buttonClass(key: TipoKey): string {
  if (!hasReport(key)) {
    if (pastDeadline(key)) return 'btn-danger';
    return 'btn-primary';
  }
  return '';
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
