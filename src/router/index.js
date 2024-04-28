import { createRouter, createWebHistory } from "vue-router";
import cookieUtils from "@/utils/cookieUtils";
import IvoUserService from "@/services/ivo/user/IvoUserService";

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/auth/login',
  },
  {
    path: '/home',
    name: 'HomePage',
    meta: {
      requiresAuth: true
    },
    component: () => import(/* webpackChunkName: "homepage" */ '../views/HomePageView.vue'),
    children: [{
      path: 'alunos',
      name: 'home.alunos',
      meta: {
        requiredRole: 'admin',
      },
      component: () => import(/* webpackChunkName: "alunos" */ '../views/AlunosView.vue'),
    }, {
      path: 'pendencias',
      name: 'home.pendencias',
      component: () => import(/* webpackChunkName: "pendencias" */ '../views/PendenciasView.vue'),
    }, {
      path: 'chat',
      name: 'home.chat',
      component: () => import(/* webpackChunkName: "conversas" */ '../views/ChatView.vue'),
    }, {
      path: 'relatorios',
      name: 'home.relatorios',
      component: () => import(/* webpackChunkName: "relatorios" */ '../views/RelatoriosView.vue'),
    }],
  },
  {
    path: '/auth/login',
    name: 'LoginView',
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  if (to.path === '/auth/login') return;

  const ivoUserService = new IvoUserService(),
    response = await ivoUserService.getCurrentUser();

  switch (response.status_code) {
    case 401:
    case 403:
      cookieUtils.deleteCookie('ivo_access_token');
      cookieUtils.deleteCookie('ivo_refresh_token');

      return { name: 'LoginView' };
    default:
      break;
  }

  console.log(response.json);
});

export default router;
