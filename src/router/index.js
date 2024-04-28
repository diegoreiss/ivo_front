import { createRouter, createWebHistory } from "vue-router";
import cookieUtils from "@/utils/cookieUtils";
import IvoUserService from "@/services/ivo/user/IvoUserService";
import LoginView from "../views/LoginView.vue";
import MudarSenhaView from "@/views/MudarSenhaView.vue";
import HomePageView from "@/views/HomePageView.vue";
import AlunosView from "@/views/AlunosView.vue";
import PendenciasView from "@/views/PendenciasView.vue";
import ChatView from "../views/ChatView.vue";
import RelatoriosView from "@/views/RelatoriosView.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/auth/login',
  },
  {
    path: '/auth',
    name: 'login',
    children: [
      {
        path: 'login',
        name: 'auth.login',
        component: LoginView,
        meta: {
          requireAuth: false,
        }
      },
      {
        path: 'mudarsenha',
        name: 'auth.mudarsenha',
        props: true,
        beforeEnter: async (to) => {
          const isAuth = await isAuthenticated();
          if (!isAuth) {
            return { name: 'auth.login' };
          }

          const ivoUserService = new IvoUserService(),
            response = await ivoUserService.getCurrentUser();
          
          if (response.json.role === 2 && !response.json.is_password_changed) {
            to.params.userId = response.json.pk;
            return true;
          } else {
            return { name: 'HomePage' }
          }
        },
        component: MudarSenhaView,
        meta: {
          requireAuth: true,
        },
      }
    ]
  },
  {
    path: '/home',
    name: 'HomePage',
    component: HomePageView,
    meta: {
      requireAuth: true,
    },
    children: [
      {
        path: 'alunos',
        name: 'home.alunos',
        component: AlunosView,
      },
      {
        path: 'pendencias',
        name: 'home.pendencias',
        component: PendenciasView,
      },
      {
        path: 'chat',
        name: 'home.chat',
        component: ChatView,
      },
      {
        path: 'relatorios',
        name: 'home.relatorios',
        component: RelatoriosView,
      }
    ],
  },
]

async function isAuthenticated() {
  const ivoUserService = new IvoUserService(),
    response = await ivoUserService.getCurrentUser();
  
  console.log(response.json);

  switch (response.status_code) {
    case 401:
    case 403:
      cookieUtils.deleteCookie('ivo_access_token');
      cookieUtils.deleteCookie('ivo_refresh_token');

      return false;
    case 200:
      return true;
    default:
      return false;
  }
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  if (!to.meta.requireAuth) {
    return;
  }
  if (!isAuthenticated() && to.name !== 'auth.login') {
    return { name: 'auth.login' };
  }
  if (to.meta.requireAuth && to.name === 'auth.mudarsenha') {
    return;
  }
});

export default router;
