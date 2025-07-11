<template>
  <div class="container py-4">
    <h2 class="mb-4">Solicitud para ser {{ tipoLabel }}</h2>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else>
      <div v-if="solicitudActiva">
        <p>
          <strong>Estado:</strong>
          <span class="me-2">{{ iconoEstado(solicitudActiva.estado) }}</span>
          <small class="text-muted">Fecha de envío: {{ formatDate(solicitudActiva.fecha_envio) }}</small>
        </p>

        <p v-if="solicitudActiva.comentario_coordinador">
          <strong>Comentario del coordinador:</strong><br />
          {{ solicitudActiva.comentario_coordinador }}
        </p>

        <button
          v-if="solicitudActiva.estado === 'rechazada'"
          class="btn btn-danger mt-3"
          @click="abrirModal"
        >
          Reenviar solicitud
        </button>
        <p v-else class="text-muted mt-3">
          No puedes enviar una nueva solicitud hasta que esta sea rechazada.
        </p>
      </div>

      <div v-else>
        <p>No has enviado ninguna solicitud todavía.</p>
        <button class="btn btn-primary mt-2" @click="abrirModal">
          Crear solicitud
        </button>
      </div>
    </div>

    <!-- MODAL -->
    <div class="modal fade" id="solicitudModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="enviarSolicitud">
            <div class="modal-header">
              <h5 class="modal-title">Nueva Solicitud</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Curso</label>
                <select class="form-select" v-model="curso" required>
                  <option disabled value="">Selecciona curso</option>
                  <option v-for="c in cursosPermitidos" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Motivación</label>
                <textarea class="form-control" rows="5" v-model="motivacion" required></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-primary">Enviar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Modal from 'bootstrap/js/dist/modal';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getSolicitudesRol, postSolicitudRol } from '@/services/roleService';
import type { SolicitudRol, SolicitudRolTipo } from '@/types';

const route = useRoute();
const tipo = ref<SolicitudRolTipo>('mentorizado');
const solicitudes = ref<SolicitudRol[]>([]);
const loading = ref(true);

const curso = ref('');
const motivacion = ref('');

onMounted(async () => {
  const t = route.query.type;
  if (t === 'mentor' || t === 'mentorizado') {
    tipo.value = t;
  }

  solicitudes.value = await getSolicitudesRol();
  loading.value = false;
});

// Etiqueta visible
const tipoLabel = computed(() =>
  tipo.value === 'mentor' ? 'Mentor' : 'Mentorizado'
);

// Cursos permitidos
const cursosPermitidos = computed(() =>
  tipo.value === 'mentor' ? ['3', '4'] : ['1', '2']
);

// Solo puedes crear si no hay ninguna o está rechazada
const solicitudActiva = computed(() => {
  const ordenadas = solicitudes.value
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return ordenadas.find(s => s.estado !== 'rechazada') || ordenadas[0] || null;
});

function iconoEstado(estado: string): string {
  switch (estado) {
    case 'pendiente': return '⏳ Pendiente';
    case 'aceptada': return '✅ Aceptada';
    case 'rechazada': return '❌ Rechazada';
    default: return estado;
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

function abrirModal() {
  const modal = new Modal(document.getElementById('solicitudModal')!);
  modal.show();
}

async function enviarSolicitud() {
  const contenido = `Curso: ${curso.value}\nMotivación: ${motivacion.value}`;
  try {
    await postSolicitudRol({ tipo: tipo.value, contenido });
    alert('Solicitud enviada correctamente.');
    window.location.reload();
  } catch (e) {
    alert('Error al enviar solicitud.');
  }
}
</script>

<style scoped>
.text-success {
  font-weight: 600;
}
.text-danger {
  font-weight: 600;
}
</style>
