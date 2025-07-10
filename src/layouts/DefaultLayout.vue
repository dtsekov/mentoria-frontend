<!-- src/layouts/DefaultLayout.vue -->
<template>
  <div class="layout">
    <!-- NAVBAR - Fixed to top, full width -->
    <nav
      class="navbar navbar-expand-md text-white fixed-top"
      :style="{ backgroundColor: navbarColor }"
    >
      <div class="container-fluid px-3 d-flex align-items-center">
        <!-- Hamburguesa - LEFT -->
        <button
          id="sidebar-toggler"
          class="btn btn-link text-white p-0 me-3"
          @click="toggleSidebar"
        >
          <i class="bi bi-list fs-4"></i>
        </button>

        <!-- Logo ETSISI - CENTER -->
        <div class="flex-fill text-center">
          <a href="https://www.etsisi.upm.es/" title="Etsi Sistemas Informáticos">
            <img
              src="/img/logo-etsisi.png"
              alt="ETSISI"
              style="max-height: 48px;"
            />
          </a>
        </div>

        <!-- Campana y usuario - RIGHT -->
        <div class="d-flex align-items-center">
          <button
            class="btn btn-link text-white p-0 position-relative me-3"
            @click="goToNotifications"
          >
            <i class="bi bi-bell fs-4"></i>
            <span
              v-if="hasUnread"
              class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
            ></span>
          </button>
          <div class="dropdown">
            <button
              class="btn btn-link dropdown-toggle text-white ps-2"
              type="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ user?.email }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li><a class="dropdown-item" href="#" @click.prevent="goToProfile">Mi zona</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item text-danger" href="#" @click.prevent="logout">Cerrar sesión</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content area below navbar -->
    <div class="main-content">
      <!-- SIDEBAR -->
      <nav id="sidebar" class="bg-secondary text-white" :class="{ 'expanded': isExpanded }">
        <div class="sidebar-header p-3 text-center">
          <h5 v-if="isExpanded" class="mb-0">
            <a href="/" class="text-white text-decoration-none">Mentoría</a>
          </h5>
          <i v-else class="bi bi-lightning-charge fs-4"></i>
        </div>

        <ul class="list-unstyled components">
          <!-- Inicio -->
          <li :class="{ active: isActive('/') }">
            <router-link class="sidebar-a" to="/">
              <i class="fa fa-home fa-fw"></i>
              <span v-if="isExpanded">Inicio</span>
            </router-link>
          </li>

          <!-- Menu items based on role -->
          <li
            v-for="item in menuItems"
            :key="item.to"
            :class="{ active: isActive(item.to) }"
          >
            <router-link class="sidebar-a" :to="item.to">
              <i :class="item.icon + ' fa-fw'"></i>
              <span v-if="isExpanded">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>

        <!-- Footer with role -->
        <div class="p-3 text-center border-top mt-auto">
          <small v-if="isExpanded" class="text-muted">{{ auth.rol }}</small>
          <small v-else class="text-muted">{{ auth.rol?.charAt(0).toUpperCase() }}</small>
        </div>
      </nav>

      <!-- Content area -->
      <div class="content-wrapper" :class="{ 'sidebar-expanded': isExpanded }">
        <div class="content-area">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { getUsuarioById } from '@/services/userService';
import { getUnreadCount } from '@/services/notificationService';
import type { User } from '@/types';

interface MenuItem {
  label: string;
  to: string;
  icon: string;
  roles: string[];
}

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const user = ref<User | null>(null);
const isExpanded = ref(false);
const hasUnread = ref(false);

const navbarColor = 'rgb(24,103,183)';

// Menu items definition
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

onMounted(async () => {
  if (auth.userId) {
    user.value = await getUsuarioById(auth.userId).catch(() => null);
    hasUnread.value = (await getUnreadCount().catch(() => 0)) > 0;
  }
});

function toggleSidebar() {
  isExpanded.value = !isExpanded.value;
  console.log('Toggle sidebar:', isExpanded.value); // Debug log
}

function logout() {
  auth.logout();
  router.replace('/login');
}

function goToProfile() {
  router.push('/perfil');
}

function goToNotifications() {
  router.push('/notifications');
}


function isActive(path: string) {
  const currentPath = route.path;
  const targetPath = path.split('?')[0];
  
  // Para la página de inicio, hacer coincidencia exacta
  if (targetPath === '/') {
    return currentPath === '/';
  }
  
  // Para otras rutas, usar startsWith como antes
  return currentPath.startsWith(targetPath);
}
</script>

<style scoped>
/* Layout principal */
.layout {
  height: 100vh;
  overflow: hidden;
}

/* Navbar fixed at top - Updated height to 64px */
.navbar {
  height: 64px;
  z-index: 1030;
}

/* Main content below navbar - Updated for 64px navbar */
.main-content {
  display: flex;
  height: calc(100vh - 64px);
  margin-top: 64px;
  overflow: hidden;
}

/* SIDEBAR STYLES - Updated for 64px navbar */
#sidebar {
  position: fixed;
  top: 64px;
  left: 0;
  width: 60px;
  height: calc(100vh - 64px);
  transition: width 0.3s ease;
  z-index: 1020;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

#sidebar.expanded {
  width: 220px;
}

.sidebar-header {
  background-color: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.components {
  flex: 1;
  overflow-y: auto;
}

.sidebar-a {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: white;
  text-decoration: none;
  transition: background-color 0.2s ease;
  min-height: 50px;
}

.sidebar-a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.sidebar-a i {
  width: 20px;
  text-align: center;
  margin-right: 15px;
}

.sidebar-a span {
  white-space: nowrap;
}

li.active .sidebar-a {
  background-color: rgba(255, 255, 255, 0.2);
  border-right: 3px solid #fff;
}

/* Content wrapper adjusts for sidebar */
.content-wrapper {
  flex: 1;
  margin-left: 45px;
  transition: margin-left 0.3s ease;
  overflow: hidden;
}

.content-wrapper.sidebar-expanded {
  margin-left: 200px;
}

/* Content area - WHITE BACKGROUND and improved layout */
.content-area {
  height: 100%;
  overflow-y: auto;
  background-color: #ffffff; /* Changed from #f8f9fa to white */
  padding: 0; /* Removed padding for full-width content */
}

/* Special styling for home page content */
.content-area > .home-page {
  padding: 1rem;
}

/* For other pages, add padding back */
.content-area > *:not(.home-page) {
  padding: 1rem;
}

/* Ensure content has proper spacing and centering */
.content-area > * {
  width: 100%;
}

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    margin-left: 0;
  }
  
  .content-wrapper.sidebar-expanded {
    margin-left: 0;
  }
  
  #sidebar.expanded {
    z-index: 1040;
  }
  
  .content-area > .home-page {
    padding: 0.75rem;
  }
  
  .content-area > *:not(.home-page) {
    padding: 0.75rem;
  }
}

@media (max-width: 576px) {
  .content-area > .home-page {
    padding: 0.5rem;
  }
  
  .content-area > *:not(.home-page) {
    padding: 0.5rem;
  }
}
</style>