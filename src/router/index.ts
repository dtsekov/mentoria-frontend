import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

// Importar vistas
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import LoginPage from '@/pages/LoginPage.vue';
import HomePage from '@/pages/HomePage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';

// Definición de rutas
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false }
  },

{
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Home',
        component: HomePage
      },
      {
        path: 'perfil',
        name: 'Perfil',
        component: () => import('@/pages/ProfilePage.vue') // placeholder futuro
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
    meta: { requiresAuth: false }
  }
];

// Crear router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Guard global de autenticación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isLoggedIn) {
    // Redirige a login si no está autenticado
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (to.name === 'Login' && isLoggedIn) {
    // Si ya está autenticado, redirige al Home
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;
