<!-- src/views/ReportCreatePage.vue -->
<template>
  <div class="container py-4">
    <h2 class="mb-4">Crear {{ tipoLabel }}</h2>

    <form @submit.prevent="onSubmit" novalidate>
      <!-- —— Campos comunes a TODOS los informes —— -->
      <div class="row g-3 mb-4">
        <div class="col-md-2">
          <label class="form-label">Curso</label>
          <input v-model="form.curso" type="text" class="form-control" required />
        </div>
        <div class="col-md-2">
          <label class="form-label">Grupo</label>
          <input v-model="form.grupo" type="text" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">Nombre completo</label>
          <input v-model="form.nombre_completo" type="text" class="form-control" required />
        </div>
        <div class="col-md-2">
          <label class="form-label">Nº reuniones</label>
          <input
            v-model.number="form.num_reuniones"
            type="number"
            min="0"
            class="form-control"
            required
          />
        </div>
        <div class="col-md-2">
          <label class="form-label">Horas dedicadas</label>
          <input
            v-model.number="form.horas_dedicadas"
            type="number"
            step="0.1"
            class="form-control"
            required
          />
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Temas de reuniones</label>
        <textarea
          v-model="form.temas_reuniones"
          class="form-control"
          rows="2"
          required
        ></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Mejoras sugeridas</label>
        <textarea
          v-model="form.mejoras_sugeridas"
          class="form-control"
          rows="2"
          required
        ></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Observaciones generales</label>
        <textarea
          v-model="form.observaciones_generales"
          class="form-control"
          rows="2"
          required
        ></textarea>
      </div>

      <!-- —— Campos de seguimiento (ambos tipos) —— -->
      <template v-if="isSeguimiento">
        <div class="mb-3">
          <label class="form-label">Tipo de actividades</label>
          <textarea
            v-model="form.tipo_actividades"
            class="form-control"
            rows="2"
            required
          ></textarea>
        </div>

        <h5 class="mt-4">Detalles de seguimiento</h5>
        <div v-if="isMentor">
          <div class="mb-3">
            <label class="form-label">Problemas detectados</label>
            <textarea
              v-model="form.problemas_detectados"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Participación mentorizada</label>
            <textarea
              v-model="form.participacion_mentorizada"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
        </div>
        <div v-else>
          <div class="mb-3">
            <label class="form-label">Actividades realizadas</label>
            <textarea
              v-model="form.actividades_realizadas"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Ayuda recibida</label>
            <textarea
              v-model="form.ayuda_recibida"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
        </div>
      </template>

      <!-- —— Campos de informe final —— -->
      <template v-if="isFinal">
        <!-- Campos compartidos de final -->
        <h5 class="mt-4">Aspectos finales</h5>
        <div class="mb-3">
          <label class="form-label">Satisfacción</label>
          <textarea
            v-model="form.satisfaccion"
            class="form-control"
            rows="2"
            required
          ></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Recomendación</label>
          <textarea
            v-model="form.recomendacion"
            class="form-control"
            rows="2"
            required
          ></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Ventajas e inconvenientes</label>
          <textarea
            v-model="form.ventajas_inconvenientes"
            class="form-control"
            rows="2"
            required
          ></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Mejoras finales</label>
          <textarea
            v-model="form.mejoras_finales"
            class="form-control"
            rows="2"
            required
          ></textarea>
        </div>

        <h5 class="mt-4">Detalles finales</h5>
        <div v-if="isMentor">
          <div class="mb-3">
            <label class="form-label">Labor del mentor</label>
            <textarea
              v-model="form.labor_mentor"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Seguimiento</label>
            <textarea
              v-model="form.seguimiento"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Labor positiva integración</label>
            <textarea
              v-model="form.labor_positiva_integracion"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Mejora implicación</label>
            <textarea
              v-model="form.mejora_implicacion"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Comunicación</label>
            <textarea
              v-model="form.comunicacion"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Organización</label>
            <textarea
              v-model="form.organizacion"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Beneficio mentor</label>
            <textarea
              v-model="form.beneficio_mentor"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
        </div>
        <div v-else>
          <div class="mb-3">
            <label class="form-label">Labor del mentorizado</label>
            <textarea
              v-model="form.labor_mentorizado"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Mejorar organización</label>
            <textarea
              v-model="form.mejorar_organizacion"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Conocer escuela</label>
            <textarea
              v-model="form.conocer_escuela"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Relaciones personales</label>
            <textarea
              v-model="form.relaciones_personales"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Exámenes</label>
            <textarea
              v-model="form.examenes"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Calificaciones</label>
            <textarea
              v-model="form.calificaciones"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">No abandono</label>
            <textarea
              v-model="form.no_abandono"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Información</label>
            <textarea
              v-model="form.informacion"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Claridad explicaciones</label>
            <textarea
              v-model="form.claridad_explicaciones"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Trato</label>
            <textarea
              v-model="form.trato"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Fácil contacto</label>
            <textarea
              v-model="form.facil_contacto"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Futuro mentor</label>
            <textarea
              v-model="form.futuro_mentor"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Trabajo mentor</label>
            <textarea
              v-model="form.trabajo_mentor"
              class="form-control"
              rows="2"
              required
            ></textarea>
          </div>
        </div>
      </template>

      <button type="submit" class="btn btn-primary" :disabled="submitting">
        <span v-if="submitting" class="spinner-border spinner-border-sm me-1"></span>
        Enviar
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { getUsuarioById } from '@/services/userService';
import { postInforme } from '@/services/reportService';
import type { Informe } from '@/types';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const submitting = ref(false);

const allowedTipos = ['seguimiento1', 'seguimiento2', 'final'] as const;
type TipoInforme = typeof allowedTipos[number];

const tipo = computed<TipoInforme>(() => {
  const q = route.query.tipo as string;
  return allowedTipos.includes(q as TipoInforme) ? (q as TipoInforme) : 'seguimiento1';
});

const tipoLabel = computed(() => {
  switch (tipo.value) {
    case 'seguimiento1': return 'Informe de Seguimiento 1';
    case 'seguimiento2': return 'Informe de Seguimiento 2';
    case 'final':        return 'Informe Final';
    default:             return 'Informe';
  }
});

const role = auth.rol as 'mentor' | 'mentorizado' | string;
const isSeguimiento = computed(() => tipo.value === 'seguimiento1' || tipo.value === 'seguimiento2');
const isFinal = computed(() => tipo.value === 'final');
const isMentor = computed(() => role === 'mentor');

// Formulario con todos los campos necesarios según modelo
const form = reactive<Partial<Informe>>({
  tipo: tipo.value,
  curso: '',
  grupo: '',
  nombre_completo: '',
  num_reuniones: 0,
  temas_reuniones: '',
  horas_dedicadas: 0,
  observaciones_generales: '',
  mejoras_sugeridas: '',
  tipo_actividades: '',

  // seguimiento mentor
  problemas_detectados: '',
  participacion_mentorizada: '',
  // seguimiento mentorizado
  actividades_realizadas: '',
  ayuda_recibida: '',

  // final común
  satisfaccion: '',
  recomendacion: '',
  ventajas_inconvenientes: '',
  mejoras_finales: '',

  // final mentor
  labor_mentor: '',
  seguimiento: '',
  labor_positiva_integracion: '',
  mejora_implicacion: '',
  comunicacion: '',
  organizacion: '',
  beneficio_mentor: '',

  // final mentorizado
  labor_mentorizado: '',
  mejorar_organizacion: '',
  conocer_escuela: '',
  relaciones_personales: '',
  examenes: '',
  calificaciones: '',
  no_abandono: '',
  informacion: '',
  claridad_explicaciones: '',
  trato: '',
  facil_contacto: '',
  futuro_mentor: '',
  trabajo_mentor: ''
});

// Precargar nombre
onMounted(async () => {
  if (auth.userId) {
    const u = await getUsuarioById(auth.userId);
    form.nombre_completo = u.nombre;
  }
});

// Enviar
async function onSubmit() {
  submitting.value = true;
  try {
    await postInforme(form as Informe);
    router.push({ name: 'Reports' });
  } catch (err: any) {
    alert('Error al enviar: ' + (err.response?.data || err.message));
  } finally {
    submitting.value = false;
  }
}
</script>
