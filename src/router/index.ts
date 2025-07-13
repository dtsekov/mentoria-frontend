import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

// Importar vistas
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import LoginPage from '@/pages/LoginPage.vue';
import HomePage from '@/pages/HomePage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import NotificationsPage from '@/pages/NotificationsPage.vue';
import ProfilePage from '@/pages/ProfilePage.vue';
import MenteesPage from '@/pages/MenteesPage.vue';
import MyMentorPage from '@/pages/MyMentorPage.vue';
import ReportsPage from '@/pages/ReportsPage.vue';
import ReportsCreatePage from '@/pages/ReportsCreatePage.vue';
import ProgressPage from '@/pages/ProgressPage.vue';
import ReportDetailsPage from '@/pages/ReportDetailsPage.vue';
import PairingsPage from '@/pages/PairingsPage.vue';
import ApprovalsPage from '@/pages/ApprovalsPage.vue';
import RequestRolePage from '@/pages/RequestRolePage.vue';
import RoleApprovalsPage from '@/pages/RoleApprovalsPage.vue';
import PasswordResetConfirmPage from '@/pages/PasswordResetConfirmPage.vue';

// Definición de rutas
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
   {
    path: '/password-reset-confirm',
    name: 'PasswordResetConfirm',
    component: PasswordResetConfirmPage,
    meta: { requiresAuth: false }
  },
  {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFoundPage,
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
        component: HomePage,
        meta: {roles: ["coordinador", "mentor", "mentorizado", "anonimo"]} // Permite acceso a todos los roles
      },
      {
        path: 'profile/:id?',
        name: 'Profile',
        component: ProfilePage,
        meta: {roles: ["coordinador", "mentor", "mentorizado", "anonimo"]} // Permite acceso a todos los roles
      },
      {
        path:"notifications",
        name:"Notifications",
        component: NotificationsPage,
        meta: {roles: ["coordinador", "mentor", "mentorizado", "anonimo"]} // Permite acceso a todos los roles
      },
      {
        path:"mentees",
        name:"Mentees",
        component: MenteesPage,
        meta: {roles: ["coordinador", "mentor"]} 
      },
      {
        path:"my-mentor",
        name:"MyMentor",
        component: MyMentorPage,
        meta: {roles: ["coordinador", "mentorizado"]} 
      },
      {
        path:"reports",
        name:"Reports",
        component: ReportsPage,
        meta: {roles: ["coordinador", "mentor", "mentorizado"]}
      },
      {
        path:"reports/create",
        name:"CreateReports",
        component: ReportsCreatePage,
        meta: {roles: ["coordinador", "mentor", "mentorizado"]}
      },
      {
        path:"progress",
        name:"ProgressReports",
        component: ProgressPage,
        meta: {roles: ["coordinador", "mentor", "mentorizado"]}
      },
      {
        path:"reports/:id",
        name:"DetailReport",
        component: ReportDetailsPage,
        meta: {roles: ["coordinador", "mentor", "mentorizado"]}
      },
      {
        path:"pairing",
        name:"Pairing",
        component: PairingsPage,
        meta: {roles: ["coordinador"]}
      },
      {
        path:"approvals",
        name:"Approvals",
        component: ApprovalsPage,
        meta: {roles: ["coordinador"]}
      },
      {
        path:"request-role",
        name:"RequestRole",
        component: RequestRolePage,
        meta: {roles: ["coordinador", "anonimo"]}
      },
      {
        path:"role-approvals",
        name:"ApproveRole",
        component: RoleApprovalsPage,
        meta: {roles: ["coordinador"]}
      },
      
    ]
  },

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
  const rol = authStore.rol;

    if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'Login', query: { redirect: to.fullPath } });
  }

  // Si la ruta define roles y el rol del usuario no está entre ellos, redirige
  const allowedRoles = (to.meta.roles as string[]) || null;
  if (allowedRoles && !allowedRoles.includes(rol || '')) {
    // Opcionalmente mostrar un mensaje o ir a página de "Forbidden"
    return next({ name: 'Home' });
  }

  if (to.name === 'Login' && isLoggedIn) {
    return next({ name: 'Home' });
  }

  next();
});

export default router;
