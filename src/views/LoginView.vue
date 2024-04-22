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
        <button class="btn text-white w-100 py-2 my-2" type="submit">
          <span
            id="spinner"
            class="spinner-border spinner-border-sm me-2 d-none"
            aria-hidden="true"
          ></span>
          <span role="status">Entrar</span>
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
    };
  },
  components: {
    ModalAdviceComponent,
  },
  methods: {
    getAccessToken(event) {
      event.preventDefault();

      const buttonTypeSubmitDOM = document
        .querySelector(".form-signin")
        .querySelector('button[type="submit"]');

      buttonTypeSubmitDOM.querySelector('span[role="status"]').innerHTML =
        "Carregando...";
      buttonTypeSubmitDOM.querySelector("#spinner").classList.toggle("d-none");

      const data = {
        username: this.username,
        password: this.password,
      };

      fetch(`${process.env.VUE_APP_IVO_API_URL}/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          buttonTypeSubmitDOM.querySelector('span[role="status"]').innerHTML =
            "Entrar";
          buttonTypeSubmitDOM
            .querySelector("#spinner")
            .classList.toggle("d-none");
          switch (response.status) {
            case 401:
              this.modalData.title = "Login";
              this.modalData.body = "Credenciais Inválidas";
              new Modal(document.querySelector("#exampleModal")).show();
              break;
            case 200:
              return response.json();
            default:
              break;
          }
        })
        .then((data) => {
          if (!data) return;

          cookieUtils.setCookie("ivo_access_token", data.access);
          cookieUtils.setCookie("ivo_refresh_token", data.refresh);
          router.push({ name: "HomePage" });
        })
        .catch((error) => {
          console.log(error);
        });
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

