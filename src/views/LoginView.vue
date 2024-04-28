<template>
  <div id="loginBody" class="d-flex align-items-center py-4">
    <main class="form-signin w-100 m-auto">
      <form @submit="getAccessToken($event)">
        <h1 class="h3 mb-3 fw-normal">IVO Chat</h1>
        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="floatingInput"
            placeholder="123"
            v-model="username"
            required
          />
          <label for="floatingInput">Matrícula</label>
        </div>
        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="floatingPassword"
            placeholder="Password"
            v-model="password"
            required
          />
          <label for="floatingPassword">Senha</label>
        </div>
        <button
          class="btn text-white w-100 py-2 my-2"
          type="submit"
          :disabled="btnLogin.disabled"
        >
          <span
            id="spinner"
            class="spinner-border spinner-border-sm me-2"
            aria-hidden="true"
            v-show="btnLogin.spinner"
          ></span>
          <span role="status">{{ btnLogin.text }}</span>
        </button>
        <p class="mt-2 mb-3 text-body-secondary">© 2024</p>
      </form>
    </main>
    <ModalAdviceComponent :modalData="modalData" />
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import cookieUtils from "@/utils/cookieUtils";
import ModalAdviceComponent from "@/components/ModalAdviceComponent.vue";
import router from "@/router";
import IvoTokenService from "@/services/ivo/token/IvoTokenService";

//import router from '@/router';

export default {
  name: "LoginView",
  data() {
    return {
      username: "",
      password: "",
      modalData: {
        title: "",
        body: "",
      },
      btnLogin: {
        text: "Entrar",
        spinner: false,
        disabled: false,
      },
    };
  },
  components: {
    ModalAdviceComponent,
  },
  methods: {
    async getAccessToken(event) {
      event.preventDefault();

      this.btnLogin.text = "Carregando...";
      this.btnLogin.spinner = !this.btnLogin.spinner;
      this.btnLogin.disabled = !this.btnLogin.disabled;

      const body = JSON.stringify({
        username: this.username,
        password: this.password,
      });

      const ivoTokenService = new IvoTokenService();
      const response = await ivoTokenService.getAccessToken(body);
      switch (response.status_code) {
        case 401:
          this.modalData.title = "Login";
          this.modalData.body = "Credenciais Inválidas";
          this.btnLogin.text = "Entrar";
          new Modal(document.querySelector("#exampleModal")).show();
          this.btnLogin.spinner = !this.btnLogin.spinner;
          this.btnLogin.disabled = !this.btnLogin.disabled;
          break;
        case 200:
          cookieUtils.setCookie("ivo_access_token", response.json.access);
          cookieUtils.setCookie("ivo_refresh_token", response.json.refresh);
          router.push({ name: "auth.mudarsenha" });
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style scoped>
#loginBody {
  height: 100vh;
  background-color: #faf1e4;
}

.form-signin {
  max-width: 330px;
  padding: 1rem;
}

.form-signin input[type="text"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.form-signin button[type="submit"] {
  background-color: #da494e !important;
}
</style>

