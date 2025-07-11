<!-- src/views/PairingsPage.vue -->
<template>
  <div class="container py-4">
    <h2 class="mb-4">Emparejar Mentores y Mentorizados</h2>

    <!-- FILTROS -->
    <div class="row g-2 mb-3">
      <div class="col-md-4">
        <input
          v-model="filterName"
          class="form-control"
          placeholder="Filtrar por nombre"
        />
      </div>
      <div class="col-md-3">
        <select v-model="filterPaired" class="form-select">
          <option value="">Todos</option>
          <option value="yes">Con pairing</option>
          <option value="no">Sin pairing</option>
        </select>
      </div>
    </div>

    <div class="row g-4">
      <!-- MENTORES -->
      <div class="col-md-6">
        <h4>Mentores</h4>
        <table class="table table-hover">
          <thead>
            <tr><th>Nombre</th><th>Pairing</th></tr>
          </thead>
          <tbody>
            <tr
              v-for="m in filteredMentors"
              :key="m.id"
              @click="openModal(m.id)"
              style="cursor: pointer;"
            >
              <td>{{ m.nombre }}</td>
              <td>
                <i
                  class="fa"
                  :class="hasPairing(m.id)
                    ? 'fa-check-circle text-success'
                    : 'fa-times-circle text-danger'"
                ></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- MENTORIZADOS -->
      <div class="col-md-6">
        <h4>Mentorizados</h4>
        <table class="table table-hover">
          <thead>
            <tr><th>Nombre</th><th>Pairing</th></tr>
          </thead>
          <tbody>
            <tr
              v-for="t in filteredMentees"
              :key="t.id"
            >
              <td>{{ t.nombre }}</td>
              <td>
                <i
                  class="fa"
                  :class="hasPairingForMentee(t.id)
                    ? 'fa-check-circle text-success'
                    : 'fa-times-circle text-danger'"
                ></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL: aparece sólo al hacer click en un mentor -->
    <b-modal v-model="showModal" title="Emparejar Mentor" size="lg">
      <div v-if="selectedMentor !== null">
        <div class="row">
          <div class="col-md-6">
            <h5>Mentorizados actuales</h5>
            <ul class="list-group">
              <li
                v-for="u in currentMentees"
                :key="u.id"
                class="list-group-item"
              >
                {{ u.nombre }}
              </li>
              <li v-if="currentMentees.length === 0" class="list-group-item text-muted">
                Ninguno asignado
              </li>
            </ul>
          </div>
          <div class="col-md-6">
            <h5>Posibles mentorizados</h5>
            <ul class="list-group">
              <li
                v-for="u in possibleMentees"
                :key="u.id"
                class="list-group-item"
                @click="pair(selectedMentor!, u.id)"
                style="cursor: pointer;"
              >
                {{ u.nombre }}
              </li>
              <li v-if="possibleMentees.length === 0" class="list-group-item text-muted">
                No hay mentorizados disponibles
              </li>
            </ul>
          </div>
        </div>
      </div>
      <template #modal-footer>
        <button class="btn btn-secondary" @click="showModal = false">
          Cerrar
        </button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { getUsuarios } from '@/services/userService';
import { getPairings, createPairing } from '@/services/pairingService';
import type { User, Pairing } from '@/types';

const allUsers = ref<User[]>([]);
const pairings = ref<Pairing[]>([]);
const loading = ref(true);

const filterName = ref('');
const filterPaired = ref<'yes' | 'no' | ''>('');

const showModal = ref(false);
const selectedMentor = ref<number | null>(null);

onMounted(async () => {
  const [users, ps] = await Promise.all([getUsuarios(), getPairings()]);
  allUsers.value = users.filter(u => u.activo);
  pairings.value = ps;
  loading.value = false;
});

const mentors = computed(() =>
  allUsers.value.filter(u => u.rol_actual === 'mentor')
);
const mentees = computed(() =>
  allUsers.value.filter(u => u.rol_actual === 'mentorizado')
);

function hasPairing(mentorId: number) {
  return pairings.value.some(p => p.mentor === mentorId);
}
function hasPairingForMentee(menteeId: number) {
  return pairings.value.some(p => p.mentorizado === menteeId);
}

const filteredMentors = computed(() =>
  mentors.value.filter(u => {
    const matchName = u.nombre.toLowerCase().includes(filterName.value.toLowerCase());
    const matchPaired =
      filterPaired.value === '' ||
      (filterPaired.value === 'yes' && hasPairing(u.id)) ||
      (filterPaired.value === 'no' && !hasPairing(u.id));
    return matchName && matchPaired;
  })
);

const filteredMentees = computed(() =>
  mentees.value.filter(u => {
    const matchName = u.nombre.toLowerCase().includes(filterName.value.toLowerCase());
    const matchPaired =
      filterPaired.value === '' ||
      (filterPaired.value === 'yes' && hasPairingForMentee(u.id)) ||
      (filterPaired.value === 'no' && !hasPairingForMentee(u.id));
    return matchName && matchPaired;
  })
);

const currentMentees = computed<User[]>(() => {
  if (selectedMentor.value === null) return [];
  return pairings.value
    .filter(p => p.mentor === selectedMentor.value)
    .map(p => allUsers.value.find(u => u.id === p.mentorizado)!)
    .filter(Boolean);
});

// Ahora sólo aquellos mentees sin ningún pairing
const possibleMentees = computed<User[]>(() =>
  mentees.value.filter(u => !hasPairingForMentee(u.id))
);

function openModal(mentorId: number) {
  selectedMentor.value = mentorId;
  showModal.value = true;
}

async function pair(mentorId: number, menteeId: number) {
  await createPairing({ mentor: mentorId, mentorizado: menteeId });
  pairings.value = await getPairings();
}
</script>
