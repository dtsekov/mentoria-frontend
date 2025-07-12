<!-- src/views/ReportDetailPage.vue -->
<template>
  <div class="container py-4">
    <h2 class="mb-4">Detalle del Informe #{{ id }}</h2>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="error" class="alert alert-warning">
      No tienes permiso para ver este informe.
    </div>

    <div v-else-if="inf">
      <!-- TS sabe que `inf` no es null -->
      <div class="mb-4">
        <strong>Tipo:</strong> {{ inf.tipo }} |
        <strong>Estado:</strong>
        <span
          :class="`text-${inf.estado === 'aprobado' ? 'success' : inf.estado === 'devuelto' ? 'danger' : 'warning'}`"
        >
          {{ inf.estado }}
        </span>
      </div>

      <table class="table table-sm">
        <tbody>
          <tr><th>Curso</th><td>{{ inf.curso }}</td></tr>
          <tr><th>Grupo</th><td>{{ inf.grupo }}</td></tr>
          <tr><th>Nombre completo</th><td>{{ inf.nombre_completo }}</td></tr>
          <tr><th>Nº reuniones</th><td>{{ inf.num_reuniones }}</td></tr>
          <tr><th>Temas reuniones</th><td>{{ inf.temas_reuniones }}</td></tr>
          <tr><th>Horas dedicadas</th><td>{{ inf.horas_dedicadas }}</td></tr>
          <tr v-if="isSeguimiento"><th>Tipo actividades</th><td>{{ inf.tipo_actividades }}</td></tr>
          <tr><th>Mejoras sugeridas</th><td>{{ inf.mejoras_sugeridas }}</td></tr>
          <tr><th>Observaciones generales</th><td>{{ inf.observaciones_generales }}</td></tr>

          <!-- Campos de seguimiento -->
          <tr v-if="isSeguimiento && isMentor"><th>Problemas detectados</th><td>{{ inf.problemas_detectados }}</td></tr>
          <tr v-if="isSeguimiento && isMentor"><th>Participación</th><td>{{ inf.participacion_mentorizada }}</td></tr>
          <tr v-if="isSeguimiento && !isMentor"><th>Actividades realizadas</th><td>{{ inf.actividades_realizadas }}</td></tr>
          <tr v-if="isSeguimiento && !isMentor"><th>Ayuda recibida</th><td>{{ inf.ayuda_recibida }}</td></tr>

          <!-- Campos finales comunes -->
          <tr v-if="isFinal"><th>Satisfacción</th><td>{{ inf.satisfaccion }}</td></tr>
          <tr v-if="isFinal"><th>Recomendación</th><td>{{ inf.recomendacion }}</td></tr>
          <tr v-if="isFinal"><th>Ventajas / Inconvenientes</th><td>{{ inf.ventajas_inconvenientes }}</td></tr>
          <tr v-if="isFinal"><th>Mejoras finales</th><td>{{ inf.mejoras_finales }}</td></tr>

          <!-- Campos de informe final: mentor -->
          <tr v-if="isFinal && isMentor"><th>Labor mentor</th><td>{{ inf.labor_mentor }}</td></tr>
          <tr v-if="isFinal && isMentor"><th>Seguimiento</th><td>{{ inf.seguimiento }}</td></tr>
          <tr v-if="isFinal && isMentor"><th>Labor positiva integración</th><td>{{ inf.labor_positiva_integracion }}</td></tr>
          <tr v-if="isFinal && isMentor"><th>Mejora implicación</th><td>{{ inf.mejora_implicacion }}</td></tr>
          <tr v-if="isFinal && isMentor"><th>Comunicación</th><td>{{ inf.comunicacion }}</td></tr>
          <tr v-if="isFinal && isMentor"><th>Organización</th><td>{{ inf.organizacion }}</td></tr>
          <tr v-if="isFinal && isMentor"><th>Beneficio mentor</th><td>{{ inf.beneficio_mentor }}</td></tr>

          <!-- Campos de informe final: mentorizado -->
          <tr v-if="isFinal && !isMentor"><th>Labor mentorizado</th><td>{{ inf.labor_mentorizado }}</td></tr>
          <tr v-if="isFinal && !isMentor"><th>Mejorar organización</th><td>{{ inf.mejorar_organizacion }}</td></tr>
          <tr v-if="isFinal && !isMentor"><th>Conocer escuela</th><td>{{ inf.conocer_escuela }}</td></tr>
          <tr v-if="isFinal && !isMentor"><th>Relaciones personales</th><td>{{ inf.relaciones_personales }}</td></tr>
          <tr v-if="isFinal && !isMentor"><th>Exámenes</th><td>{{ inf.examenes }}</td></tr>
          <tr v-if="isFinal && !isMentor"><th>Calificaciones</th><td>{{ inf.calificaciones }}</td></tr>
          <tr v-if="isFinal && !isMentor"><th>No abandono</th><td>{{ inf.no_abandono }}</td></tr>
          <tr v-if="isFinal && !isMentor"><th>Información</th><td>{{ inf.informacion }}</td></tr>
          <tr v-if="isFinal && !isMentor"><th>Claridad explicaciones</th><td>{{ inf.claridad_explicaciones }}</td></tr>
          <tr v-if="isFinal && !isMentor"><th>Trato</th><td>{{ inf.trato }}</td></tr>
          <tr v-if="isFinal && !isMentor"><th>Fácil contacto</th><td>{{ inf.facil_contacto }}</td></tr>
          <tr v-if="isFinal && !isMentor"><th>Futuro mentor</th><td>{{ inf.futuro_mentor }}</td></tr>
          <tr v-if="isFinal && !isMentor"><th>Trabajo mentor</th><td>{{ inf.trabajo_mentor }}</td></tr>
        </tbody>
      </table>

      <!-- Acciones de coordinador -->
      <div v-if="isCoordinador" class="mt-4">
        <button class="btn btn-success me-2" @click="patchEstado('aprobado')" :disabled="updating">
          Aprobar
        </button>
        <button class="btn btn-danger" @click="patchEstado('devuelto')" :disabled="updating">
          Rechazar
        </button>
      </div>
    </div>

    <div v-else class="alert alert-info">
      Informe no encontrado.
    </div>
  </div>
</template>


<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { getInformeById, patchInforme } from '@/services/reportService';
import type { Informe } from '@/types';
import { postNotification } from '@/services/notificationService';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const id = Number(route.params.id);

const loading = ref(true);
const error = ref(false);
const inf = ref<Informe|null>(null);
const updating = ref(false);

onMounted(async () => {
  try {
    inf.value = await getInformeById(id);
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
});

const isFinal = computed(() => inf.value?.tipo === 'final');
const isSeguimiento = computed(() => inf.value?.tipo === 'seguimiento1' || inf.value?.tipo === 'seguimiento2');
const isMentor = computed(() => auth.rol === 'mentor');
const isCoordinador = computed(() => auth.rol === 'coordinador');

function formatDate(s: string) {
  return new Date(s).toLocaleString();
}

async function patchEstado(nuevo: 'aprobado' | 'devuelto') {
  updating.value = true;
  try {
    // 1) Actualizar el estado en el backend
    await patchInforme(id, { estado: nuevo });
    // 2) Reflejar el cambio en la UI
    if (inf.value) {
      inf.value.estado = nuevo;
    }

    // 3) Enviar notificación
    const tipoLabel = inf.value!.tipo === 'final'
      ? 'Informe Final'
      : inf.value!.tipo === 'seguimiento1'
        ? 'Informe de Seguimiento 1'
        : 'Informe de Seguimiento 2';

    const mensaje = `Tu ${tipoLabel} ha sido ${nuevo === 'aprobado' ? 'aprobado' : 'devuelto'}.`;
    await postNotification({
      usuario: inf.value!.user,
      tipo: 'info',
      mensaje
    });

  } catch (e) {
    console.error('Error al actualizar o notificar:', e);
  } finally {
    updating.value = false;
  }
}
</script>
