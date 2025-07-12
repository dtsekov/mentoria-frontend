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
        component: HomePage
      },
      {
        path: 'profile/:id?',
        name: 'Profile',
        component: ProfilePage 
      },
      {
        path:"notifications",
        name:"Notifications",
        component: NotificationsPage
      },
      {
        path:"mentees",
        name:"Mentees",
        component: MenteesPage
      },
      {
        path:"my-mentor",
        name:"MyMentor",
        component: MyMentorPage
      },
      {
        path:"reports",
        name:"Reports",
        component: ReportsPage
      },
      {
        path:"reports/create",
        name:"CreateReports",
        component: ReportsCreatePage
      },
      {
        path:"progress",
        name:"ProgressReports",
        component: ProgressPage
      },
      {
        path:"reports/:id",
        name:"DetailReport",
        component: ReportDetailsPage
      },
      {
        path:"pairing",
        name:"Pairing",
        component: PairingsPage
      },
      {
        path:"approvals",
        name:"Approvals",
        component: ApprovalsPage
      },
      {
        path:"request-role",
        name:"RequestRole",
        component: RequestRolePage
      },
      {
        path:"role-approvals",
        name:"ApproveRole",
        component: RoleApprovalsPage
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
