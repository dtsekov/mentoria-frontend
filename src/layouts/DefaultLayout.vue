<template>
  <div class="layout">
    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-md navbar-dark bg-dark text-white fixed-top px-3" id="top-bar">
      <!-- Hamburguesa -->
      <button id="sidebar-toggler" class="hamburger is-active me-3 text-white" type="button" @click="toggleSidebar">
        <span class="hamburger-box">
          <span class="hamburger-inner"></span>
        </span>
      </button>

      <!-- Logo centrado en md+ -->
      <div class="d-none d-md-block offset-2 col-lg-6 text-center">
        <a href="https://www.etsisi.upm.es/" title="Etsi Sistemas Informáticos">
          <img class="img-fluid mx-auto d-block" src="/img/logo-etsisi.png" alt="ETSISI" style="max-height: 40px;" />
        </a>
      </div>

      <!-- Icono notificaciones -->
      <button class="btn btn-dark position-relative me-3" @click="goToNotifications">
        <i class="fa fa-bell"></i>
        <span v-if="hasUnread" class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
      </button>

      <!-- Usuario dropdown -->
      <div class="btn-group nav-item col justify-content-end align-content-end">
        <div class="nav-item dropdown">
          <button
            type="button"
            class="btn btn-dark nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span class="d-inline-block text-truncate userLogged">{{ user?.email }}</span>
          </button>
          <div class="dropdown-menu dropdown-menu-end w-100">
            <a class="dropdown-item" href="#" @click.prevent="goToProfile">Mi zona</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item text-danger" href="#" @click.prevent="logout">Cerrar sesión</a>
          </div>
        </div>
      </div>
    </nav>

    <!-- BODY -->
    <div class="d-flex layout-body">
      <!-- Sidebar -->
      <Sidebar :show="showSidebar" />

      <!-- Contenido -->
      <main class="content-area p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';
import { useAuthStore } from '@/store/authStore';
import { getUsuarioById } from '@/services/userService';
import type { User } from '@/types';
import { getUnreadCount } from '@/services/notificationService'; // si existe

const router = useRouter();
const auth = useAuthStore();
const user = ref<User | null>(null);
const showSidebar = ref(true);
const hasUnread = ref(false);

onMounted(async () => {
  if (auth.userId) {
    // Cargar perfil
    user.value = await getUsuarioById(auth.userId);
    // Cargar notificaciones no leídas (opcional)
    try {
      const count = await getUnreadCount();
      hasUnread.value = count > 0;
    } catch {
      hasUnread.value = false;
    }
  }
});

function toggleSidebar() {
  showSidebar.value = !showSidebar.value;
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
</script>

<style scoped>
/* igual que antes */
.layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
#top-bar {
  height: 56px;
  z-index: 1030;
}
.layout-body {
  flex: 1;
  margin-top: 56px;
  overflow: hidden;
}
.content-area {
  flex: 1;
  overflow-y: auto;
  background-color: #f8f9fa;
}
/* Hamburguesa */
.hamburger {
  padding: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
}
.hamburger-box {
  width: 24px;
  height: 18px;
  position: relative;
}
.hamburger-inner,
.hamburger-inner::before,
.hamburger-inner::after {
  background-color: #fff;
  position: absolute;
  width: 100%;
  height: 2px;
  transition: all 0.3s;
}
.hamburger-inner {
  top: 50%;
  transform: translateY(-50%);
}
.hamburger-inner::before {
  content: '';
  top: -8px;
}
.hamburger-inner::after {
  content: '';
  top: 8px;
}
</style>
