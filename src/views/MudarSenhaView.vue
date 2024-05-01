<template>
  <div id="pageBody" class="d-flex align-items-center py-4">
    <main class="form-mudar-senha w-100 m-auto">
      <form @submit="trocarSenha($event)" class="needs-validation" novalidate>
        <h1 class="h3 mb-3 fw-normal">Trocar Senha</h1>
        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="password1"
            placeholder="123"
            required
            v-model="data.password"
          />
          <label for="password1">Senha</label>
        </div>
        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="password2"
            placeholder="Password"
            required
            v-model="data.confirmPassword"
            @input="checkInput($event)"
          />
          <label for="password2">Confirmar Senha</label>
        </div>
        <button
          class="btn text-white w-100 py-2 my-2"
          type="submit"
          :disabled="btnConfirm.disabled"
        >
          <span
            id="spinner"
            class="spinner-border spinner-border-sm me-2"
            aria-hidden="true"
            v-show="btnConfirm.spinner"
          ></span>
          <span role="status">{{ btnConfirm.text }}</span>
        </button>
        <div class="text-danger" v-show="formFeedback.show">
          {{ formFeedback.text }}
        </div>
        <router-link to="/auth/login">
          <p class="mt-2 mb-3 text-body-secondary">Voltar</p>
        </router-link>
      </form>
    </main>
  </div>
</template>

<script>
import router from '@/router';
import IvoUserService from '@/services/ivo/user/IvoUserService';


export default {
  name: "MudarSenhaView",
  data() {
    return {
      data: {
        password: "",
        confirmPassword: "",
      },
      btnConfirm: {
        text: "Confirmar",
        spinner: false,
        disabled: false,
      },
      formFeedback: {
        show: false,
        text: "",
      },
    };
  },
  props: {
    userUuid: Object,
  },
  methods: {
    async trocarSenha(event) {
      event.preventDefault();
      this.btnConfirm.disabled = !this.btnConfirm.disabled;
      this.btnConfirm.spinner = !this.btnConfirm.spinner;
      this.btnConfirm.text = "Carregando...";
      
      const ivoUserservice = new IvoUserService(),
        response = await ivoUserservice.mudarSenhaAluno(JSON.stringify({
          password: this.data.password,
          confirm_password: this.data.confirmPassword,
        }), this.userUuid);
      
      switch (response.status_code) {
        case 200:
          router.push({ name: 'HomePage' })
          break;
        default:
          router.push({ name: 'login' })
          break;
      }
    },
    checkInput(event) {
      const password1 = document.querySelector('input[id="password1"]').value;
      if (!(event.target.value === password1)) {
        this.btnConfirm.disabled = true;
        this.btnConfirm.text = "Senhas não coincidem";

        return;
      }

      this.btnConfirm.disabled = false;
      this.btnConfirm.text = "Confirmar";
    },
  },
};
</script>

<style scoped>
#pageBody {
  height: 100vh;
  background-color: #faf1e4;
}

.form-mudar-senha {
  max-width: 330px;
  padding: 1rem;
}

.form-mudar-senha input[id="password1"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-mudar-senha input[id="password2"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.form-mudar-senha button[type="submit"] {
  background-color: #da494e !important;
}
</style>
