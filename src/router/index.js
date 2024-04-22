import { createRouter, createWebHistory } from "vue-router";
import cookieUtils from "@/utils/cookieUtils";

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

  const auth = cookieUtils.getCookie('ivo_access_token');

  if (!auth) return { name: 'LoginView' };

  const res = await fetch(`${process.env.VUE_APP_IVO_API_URL}/user/current/`, {
    headers: {
      Authorization: `Bearer ${auth}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    switch (response.status) {
      case 200:
        return response.json();
      default:
        return response.status;
    }
  });

  if (res === 401 || res === 403) {
    cookieUtils.deleteCookie('ivo_access_token');
    cookieUtils.deleteCookie('ivo_refresh_token');
    return { name: 'LoginView' };
  } 
});

export default router;
