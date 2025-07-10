<template>
  <nav id="sidebar" :class="{ active: show }" class="bg-secondary text-white">
    <div class="sidebar-header p-3">
      <h4><a href="/" class="text-white text-decoration-none">Mentoría</a></h4>
    </div>
    <ul class="list-unstyled components">
      <li v-for="item in menuItems" :key="item.path" :class="{ active: isActive(item.path) }">
        <router-link class="sidebar-a d-flex align-items-center text-white p-2" :to="item.to">
          <i :class="item.icon + ' fa-fw me-2'"></i>
          <span>{{ item.label }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

interface MenuItem {
  label: string;
  to: string;
  path: string;    // para comparar con route.path
  icon: string;
}

const props = defineProps<{
  show: boolean;
}>();

const route = useRoute();
const auth = useAuthStore();

const menuItems = computed<MenuItem[]>(() => {
  const r = auth.rol;
  const items: MenuItem[] = [];

  // Anónimo
  if (r === 'anonimo') {
    items.push(
      { label: 'Solicitar Mentor', to: '/request-role?type=mentor', path: '/request-role', icon: 'fa fa-user-plus' },
      { label: 'Solicitar Mentorizado', to: '/request-role?type=mentorizado', path: '/request-role', icon: 'fa fa-user-plus' }
    );
  }

  // Mentorizado
  if (r === 'mentorizado') {
    items.push(
      { label: 'Mi Mentor', to: '/my-mentor', path: '/my-mentor', icon: 'fa fa-user' },
      { label: 'Informes', to: '/reports', path: '/reports', icon: 'fa fa-file-alt' },
      { label: 'Progreso', to: '/progress', path: '/progress', icon: 'fa fa-chart-line' }
    );
  }

  // Mentor
  if (r === 'mentor') {
    items.push(
      { label: 'Mis Mentorizados', to: '/mentees', path: '/mentees', icon: 'fa fa-users' },
      { label: 'Informes', to: '/reports', path: '/reports', icon: 'fa fa-file-alt' },
      { label: 'Progreso', to: '/progress', path: '/progress', icon: 'fa fa-chart-line' }
    );
  }

  // Coordinador
  if (r === 'coordinador') {
    items.push(
      { label: 'Emparejar', to: '/pairing', path: '/pairing', icon: 'fa fa-handshake' },
      { label: 'Aprobaciones', to: '/approvals', path: '/approvals', icon: 'fa fa-check-circle' }
    );
  }

  return items;
});

function isActive(path: string): boolean {
  return route.path.startsWith(path);
}
</script>

<style scoped>
#sidebar {
  position: fixed;
  top: 56px; /* debajo del navbar */
  left: 0;
  width: 220px;
  height: calc(100vh - 56px);
  overflow-y: auto;
  transition: transform 0.3s ease;
  transform: translateX(0);
  z-index: 1020;
}
#sidebar.active {
  transform: translateX(0);
}
#sidebar:not(.active) {
  transform: translateX(-100%);
}
.sidebar-header {
  background: #343a40;
}
.sidebar-a {
  display: block;
  width: 100%;
  color: inherit;
  text-decoration: none;
}
.sidebar-a:hover {
  background: rgba(255, 255, 255, 0.1);
  text-decoration: none;
}
.components li.active > .sidebar-a {
  background: rgba(255, 255, 255, 0.2);
}
</style>
