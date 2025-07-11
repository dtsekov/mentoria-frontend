<template>
  <div class="container py-4">
    <h2 class="mb-4">Aprobación de Solicitudes de Rol</h2>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else>
      <div v-if="pendientes.length === 0">
        <p class="text-muted">No hay solicitudes pendientes.</p>
      </div>

      <div
        v-for="solicitud in pendientes"
        :key="solicitud.id"
        class="card mb-3"
      >
        <div class="card-body">
          <h5>{{ getNombreUsuario(solicitud.usuario) }} solicita ser <strong>{{ solicitud.tipo }}</strong></h5>
          <p><strong>Curso:</strong> {{ parseContenido(solicitud.contenido).curso }}</p>
          <p><strong>Motivación:</strong><br /> {{ parseContenido(solicitud.contenido).motivacion }}</p>
          <p class="text-muted"><small>Enviado el {{ formatDate(solicitud.fecha_envio) }}</small></p>

          <div class="mt-3">
            <button class="btn btn-success me-2" @click="aprobar(solicitud.id, solicitud.usuario, solicitud.tipo)">
              Aprobar
            </button>
            <button class="btn btn-danger" @click="abrirModal(solicitud.id)">
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de comentario para rechazar -->
    <div class="modal fade" id="rechazoModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="confirmarRechazo">
            <div class="modal-header">
              <h5 class="modal-title">Rechazar solicitud</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Comentario para el usuario</label>
                <textarea class="form-control" v-model="comentario" required></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button class="btn btn-danger" type="submit">Rechazar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Modal from 'bootstrap/js/dist/modal';
import { ref, onMounted, computed} from 'vue';
import { getSolicitudesRol, patchSolicitudRol } from '@/services/roleService';
import { getUsuarios } from '@/services/userService';
import type { SolicitudRol, User } from '@/types';
import { patchUsuario } from '@/services/userService';

const solicitudes = ref<SolicitudRol[]>([]);
const usuarios = ref<User[]>([]);
const loading = ref(true);

const idRechazo = ref<number | null>(null);
const comentario = ref('');

onMounted(async () => {
  [solicitudes.value, usuarios.value] = await Promise.all([
    getSolicitudesRol(),
    getUsuarios()
  ]);
  loading.value = false;
});

const pendientes = computed(() =>
  solicitudes.value.filter(s => s.estado === 'pendiente')
);

function getNombreUsuario(userId: number): string {
  const u = usuarios.value.find(u => u.id === userId);
  return u ? u.nombre : `Usuario ${userId}`;
}

function parseContenido(contenido: string): { curso: string, motivacion: string } {
  const cursoMatch = contenido.match(/Curso:\s*(\d)/);
  const motivacionMatch = contenido.match(/Motivación:\s*([\s\S]*)/);
  return {
    curso: cursoMatch ? cursoMatch[1] : 'N/D',
    motivacion: motivacionMatch ? motivacionMatch[1].trim() : 'N/D',
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

async function aprobar(id: number, userId: number, tipo: 'mentor' | 'mentorizado') {
  await patchSolicitudRol(id, { estado: 'aceptada' });
  await patchUsuario(userId, { rol_actual: tipo });

  solicitudes.value = solicitudes.value.map(s =>
    s.id === id ? { ...s, estado: 'aceptada' } : s
  );

}

function abrirModal(id: number) {
  idRechazo.value = id;
  comentario.value = '';
  const modal = new Modal(document.getElementById('rechazoModal')!);
  modal.show();
}

async function confirmarRechazo() {
  if (!idRechazo.value) return;
  await patchSolicitudRol(idRechazo.value, {
    estado: 'rechazada',
    comentario_coordinador: comentario.value
  });
  solicitudes.value = solicitudes.value.map(s =>
    s.id === idRechazo.value ? { ...s, estado: 'rechazada', comentario_coordinador: comentario.value } : s
  );
  idRechazo.value = null;
  const modal = Modal.getInstance(document.getElementById('rechazoModal')!);
  modal?.hide();
}
</script>
