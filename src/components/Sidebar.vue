<template>
  <nav
    id="sidebar"
    class="bg-secondary text-white d-flex flex-column sidebar"
    :class="{ 'expanded': expanded }"
  >
    <!-- Título Mentoria -->
    <div class="sidebar-header p-3 text-center">
      <span v-if="expanded" class="h5 mb-0">Mentoría</span>
      <i v-else class="bi bi-lightning-charge fs-4"></i>
    </div>

    <ul class="list-unstyled flex-grow-1 p-0 m-0">
      <!-- Inicio -->
      <li :class="{ active: isActive('/') }">
        <router-link
          class="d-flex align-items-center p-3 text-white sidebar-link"
          to="/"
          :title="!expanded ? 'Inicio' : ''"
        >
          <i class="fa fa-home sidebar-icon"></i>
          <span v-if="expanded" class="sidebar-text">Inicio</span>
        </router-link>
      </li>

      <!-- Resto de ítems según rol -->
      <li
        v-for="item in menuItems"
        :key="item.to"
        :class="{ active: isActive(item.to) }"
      >
        <router-link
          class="d-flex align-items-center p-3 text-white sidebar-link"
          :to="item.to"
          :title="!expanded ? item.label : ''"
        >
          <i :class="item.icon + ' sidebar-icon'"></i>
          <span v-if="expanded" class="sidebar-text">{{ item.label }}</span>
        </router-link>
      </li>
    </ul>

    <!-- Pie con rol -->
    <div class="p-3 text-center border-top">
      <small v-if="expanded" class="text-muted">{{ auth.rol }}</small>
      <small v-else class="text-muted" :title="auth.rol || ''">{{ auth.rol?.charAt(0).toUpperCase() }}</small>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

interface MenuItem {
  label: string;
  to: string;
  icon: string;
  roles: string[];
}

// Props
const props = defineProps<{ expanded: boolean }>();
const { expanded } = props;

// Routing & auth
const route = useRoute();
const auth = useAuthStore();

// Definición de menús
const allItems: MenuItem[] = [
  { label: 'Solicitar Mentor', to: '/request-role?type=mentor', icon: 'fa fa-user-plus', roles: ['anonimo'] },
  { label: 'Solicitar Mentorizado', to: '/request-role?type=mentorizado', icon: 'fa fa-user-plus', roles: ['anonimo'] },
  { label: 'Mi Mentor', to: '/my-mentor', icon: 'fa fa-user', roles: ['mentorizado'] },
  { label: 'Informes', to: '/reports', icon: 'fa fa-file-alt', roles: ['mentorizado','mentor'] },
  { label: 'Progreso', to: '/progress', icon: 'fa fa-chart-line', roles: ['mentorizado','mentor'] },
  { label: 'Mis Mentorizados', to: '/mentees', icon: 'fa fa-users', roles: ['mentor'] },
  { label: 'Emparejar', to: '/pairing', icon: 'fa fa-handshake', roles: ['coordinador'] },
  { label: 'Aprobaciones', to: '/approvals', icon: 'fa fa-check-circle', roles: ['coordinador'] },
];

const menuItems = computed(() =>
  allItems.filter(item => item.roles.includes(auth.rol || ''))
);

// Helper de ruta activa
function isActive(path: string) {
  return route.path.startsWith(path.split('?')[0]);
}
</script>

<style scoped>
/* Sidebar base */
.sidebar {
  position: fixed;
  top: 56px; /* Start below navbar */
  left: 0;
  width: 60px;
  height: calc(100vh - 56px);
  transition: width 0.3s ease;
  z-index: 1020;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  overflow: hidden;
}

/* Expanded sidebar */
.sidebar.expanded {
  width: 220px;
}

/* Header */
.sidebar-header {
  background-color: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Links */
.sidebar-link {
  transition: background-color 0.2s ease;
  min-height: 50px;
  white-space: nowrap;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.sidebar-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Active state */
li.active > .sidebar-link {
  background-color: rgba(255, 255, 255, 0.2);
  border-right: 3px solid #fff;
}

/* Icons */
.sidebar-icon {
  width: 20px;
  text-align: center;
  flex-shrink: 0;
  margin-right: 0;
}

/* Text appears only when expanded */
.sidebar-text {
  margin-left: 15px;
  opacity: 1;
  transition: opacity 0.3s ease;
}

/* Footer */
.sidebar div:last-child {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

/* List styles */
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  margin: 0;
  padding: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 60px;
  }
  
  .sidebar.expanded {
    width: 220px;
    z-index: 1040;
  }
}
</style>