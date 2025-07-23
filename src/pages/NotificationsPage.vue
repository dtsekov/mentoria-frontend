<!-- src/views/NotificationsPage.vue -->
<template>
  <div class="container-fluid py-4">
    <div class="d-flex mb-3 align-items-center">
      <input
        v-model="filterId"
        type="text"
        class="form-control me-2"
        placeholder="Buscar notificación por ID"
      />
      <button
        class="btn btn-primary"
        @click="markAllRead"
        :disabled="markingAll"
      >
        <span v-if="markingAll" class="spinner-border spinner-border-sm me-1"></span>
        Marcar todas como leídas
      </button>
    </div>

    <div class="row">
      <!-- Sidebar: lista de notificaciones -->
      <div class="col-3 border-end" style="max-height: 70vh; overflow-y: auto;">
        <ul class="list-group">
          <li
            v-for="n in filtered"
            :key="n.id"
            class="list-group-item d-flex align-items-center justify-content-between"
            :class="{ 'active': selected?.id === n.id }"
            @click="select(n)"
            style="cursor: pointer;"
          >
            <div>
              <i :class="iconFor(n.tipo) + ' me-2'"></i>
              <strong>#{{ n.id }}</strong>
            </div>
            <span v-if="!n.leida" class="badge bg-danger">Nuevo</span>
          </li>
        </ul>
      </div>

      <!-- Detalle de la notificación -->
      <div class="col-9">
        <div v-if="selected" class="card">
          <div class="card-header">
            <h5 class="mb-0">Notificación #{{ selected.id }}</h5>
            <small class="text-muted">{{ formatDate(selected.fecha_envio) }}</small>
          </div>
          <div class="card-body">
            <p>{{ selected.mensaje }}</p>
          </div>
        </div>
        <div v-else class="text-center text-muted">
          Selecciona una notificación para ver sus detalles.
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { getNotifications, patchNotification } from '@/services/notificationService';
import type { Notification } from '@/types';

const notifications = ref<Notification[]>([]);
const selected = ref<Notification | null>(null);
const filterId = ref('');
const markingAll = ref(false);
const marking = ref<Record<number, boolean>>({});

onMounted(async () => {
  notifications.value = await getNotifications();
});

// Filtrar por ID
const filtered = computed(() => {
  if (!filterId.value) return notifications.value;
  return notifications.value.filter(n => n.id.toString().includes(filterId.value));
});

// Seleccionar y marcar como leída
async function select(n: Notification) {
  selected.value = n;
  if (!n.leida) {
    marking.value[n.id] = true;
    const updated = await patchNotification(n.id, { leida: true });
    Object.assign(n, updated);
    marking.value[n.id] = false;
  }
}

// Icono según tipo
function iconFor(tipo: Notification['tipo']): string {
  switch (tipo) {
    case 'info': return 'fa fa-info-circle text-primary';
    case 'alerta': return 'fa fa-exclamation-triangle text-warning';
    case 'error': return 'fa fa-times-circle text-danger';
    default: return 'fa fa-bell';
  }
}

// Formateo de fecha
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString();
}

// Marcar todas como leídas
async function markAllRead() {
  markingAll.value = true;
  for (const n of notifications.value) {
    if (!n.leida) {
      marking.value[n.id] = true;
      const updated = await patchNotification(n.id, { leida: true });
      Object.assign(n, updated);
      marking.value[n.id] = false;
    }
  }
  
  markingAll.value = false;
  location.reload();
}
</script>

<style scoped>
.list-group-item.active {
  background-color: rgba(24, 103, 183, 0.1);
}
</style>
