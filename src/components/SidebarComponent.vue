<template>
  <div
    class="d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
    style="width: 280px"
  >
    <a
      href="/"
      class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
    >
      <svg class="bi pe-none me-2" width="40" height="32">
        <use xlink:href="#bootstrap"></use>
      </svg>
      <span class="fs-4">I.V.O</span>
    </a>
    <hr />
    <ul id="navbarListLinks" class="nav nav-pills flex-column mb-auto">
      <li @click="activeLink($event)" class="nav-item">
        <router-link to="/home/pendencias">
          <span class="nav-link text-white d-flex justify-content-start align-items-center gap-3">
            <i class="bi bi-clipboard-data"></i>
            Pendências
          </span>
        </router-link>
      </li>
      <li @click="activeLink($event)" class="nav-item">
        <router-link to="/home/chat">
          <span class="nav-link text-white d-flex justify-content-start align-items-center gap-3">
            <i class="bi bi-chat-left-text"></i>
            Chat
          </span>
        </router-link>
      </li>
      <li @click="activeLink($event)" class="nav-item" v-if="user.role === 1">
        <router-link to="/home/alunos">
          <span class="nav-link text-white d-flex justify-content-start align-items-center gap-3" aria-current="page">
            <i class="bi bi-people"></i>
            Alunos
          </span>
        </router-link>
      </li>
      <li @click="activeLink($event)" class="nav-item" v-if="user.role === 1">
        <router-link to="/home/relatorios">
          <span class="nav-link text-white d-flex justify-content-start align-items-center gap-3">
            <i class="bi bi-speedometer2"></i>
            Relatórios
          </span>
        </router-link>
      </li>
    </ul>
    <hr />
    <div class="dropdown">
      <a
        href="#"
        class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <strong>{{ user.firstName }}</strong>
      </a>
      <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
        <li><button class="dropdown-item" @click="logout" >Sair</button></li>
      </ul>
    </div>
  </div>
</template>

<script>
import router from '@/router';
import cookieUtils from '@/utils/cookieUtils';

export default {
  name: 'SidebarComponent',
  data() {
    return {
      user: {
        firstName: 'user',
        role: '',
      },
    }
  },
  created() {
    const auth = cookieUtils.getCookie('ivo_access_token');
    fetch(`${process.env.VUE_APP_IVO_API_URL}/user/current/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth}`,
      },
    }).then((response) => {
      switch(response.status) {
        case 200:
          return response.json();
        case 401:
          router.push({ name: 'LoginView' });
      }
    }).then((data) => {
      this.user.firstName = data.first_name;
      this.user.role = data.role;
      console.log(data);
    });
  },
  mounted() {
    this.$nextTick(function() {
      document.querySelector('#navbarListLinks').querySelector('li').querySelector('span').click();
    });
  },
  methods: {
    activeLink(event) {
      document.querySelector('#navbarListLinks')
        .querySelectorAll('span')
        .forEach(span => {
          span.classList.add('text-white');
          span.classList.remove('active');
        });
      event.target.closest('span').classList.toggle('active');
    },
    logout() {
      const refresh = cookieUtils.getCookie('ivo_refresh_token');
      console.log(refresh);

      fetch(`${process.env.VUE_APP_IVO_API_URL}/token/blacklist/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refresh,
        }),
      }).then(response => {
        switch(response.status) {
          case 200:
            cookieUtils.deleteCookie('ivo_refresh_token');
            cookieUtils.deleteCookie('ivo_access_token');
            router.push({ name: 'LoginView' });
            break;
        }
      });
    }
  }
}
</script>

<style scoped>
#navbarListLinks li a {
  text-decoration: none;
}

.active {
  background-color: #da494e !important;
}
</style>
