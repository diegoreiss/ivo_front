<template>
  <div class="m-5">
    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th scope="col" class="d-none">#</th>
          <th scope="col">Nome Completo</th>
          <th scope="col">Email</th>
          <th scope="col">Usuário Ativo</th>
          <th scope="col">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="aluno in alunos" :key="aluno.pk">
          <td class="d-none">{{ aluno.pk }}</td>
          <td>{{ aluno.first_name }} {{ aluno.last_name }}</td>
          <td>{{ aluno.email }}</td>
          <td v-if="aluno.is_active">
            <i class="bi bi-check-square-fill text-success"></i>
          </td>
          <td v-else><i class="bi bi-x-square-fill text-danger"></i></td>
          <td v-if="!aluno.is_active">
            <button
              @click="criarAcessoModal(aluno.pk, aluno.first_name, aluno.email)"
              type="button"
              class="btn btn-primary"
            >
              Criar Acesso
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Criar Acesso
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit="criarAcesso">
              <div class="mb-3">
                <label for="senha-provisoria" class="col-form-label"
                  >Senha:</label
                >
                <input
                  v-model="criarAcessoData.senha"
                  type="text"
                  class="form-control"
                  id="senha-provisoria"
                  required
                />
                <input type="hidden" name="emailAluno" />
                <input type="hidden" name="pkAluno" />
              </div>
              <div>
                <strong>OBS:</strong>
                O usuário deve trocar a senha no primeiro login.
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Fechar
                </button>
                <button
                  id="modalBtnConfirm"
                  @click="criarAcesso"
                  type="button"
                  class="btn btn-primary"
                  :disabled="btnCriarAcesso.disabled"
                >
                  <span
                    id="spinner"
                    class="spinner-border spinner-border-sm me-2 d-none"
                    aria-hidden="true"
                    v-show="btnCriarAcesso.spinner"
                  ></span>
                  <span role="status">{{ btnCriarAcesso.text }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <ToastComponent :toastData="toastData" />
  </div>
</template>

<script>
import { Modal, Toast } from "bootstrap";
import ToastComponent from "@/components/ToastComponent.vue";
import IvoUserService from "@/services/ivo/user/IvoUserService";

export default {
  name: "AlunosView",
  data() {
    return {
      alunos: [],
      criarAcessoData: {
        senha: "",
      },
      toastData: {
        header: "",
        body: "",
      },
      btnCriarAcesso: {
        text: "Confirmar",
        spinner: false,
        disabled: false,
      },
    };
  },
  components: {
    ToastComponent,
  },
  created() {},
  mounted() {
    this.getAllAlunos();
  },
  methods: {
    async getAllAlunos() {
      const ivoUserService = new IvoUserService(),
        response = await ivoUserService.getAllAlunos();

      switch (response.status_code) {
        case 200:
          this.alunos = response.json;
          break;
        default:
          break;
      }
    },
    criarAcessoModal(pk, firstName, email) {
      const exampleModal = document.querySelector("#exampleModal");
      exampleModal.querySelector(
        'input[type="hidden"][name="emailAluno"]'
      ).value = email;
      exampleModal.querySelector('input[type="hidden"][name="pkAluno"]').value =
        pk;
      exampleModal.querySelector(
        ".modal-title"
      ).innerHTML = `Criar acesso para ${firstName}`;
      new Modal(exampleModal, {}).show();
    },
    async criarAcesso() {
      const exampleModal = document.querySelector("#exampleModal"),
        data = {
          pk: exampleModal.querySelector('input[type="hidden"][name="pkAluno"]')
            .value,
          email: exampleModal.querySelector(
            'input[type="hidden"][name="emailAluno"]'
          ).value,
          senha: this.criarAcessoData.senha,
        };

      if (!data.senha) return;

      this.btnCriarAcesso.text = "Aguarde...";
      this.btnCriarAcesso.spinner = !this.btnCriarAcesso.spinner;
      this.btnCriarAcesso.disabled = !this.btnCriarAcesso.disabled;

      const ivoUserService = new IvoUserService(),
        response = await ivoUserService.criarAcessoAluno(
          JSON.stringify({
            password: data.senha,
          }),
          data.pk
        );

      switch (response.status_code) {
        case 200:
          this.btnCriarAcesso.text = "Confirmar";
          this.btnCriarAcesso.spinner = !this.btnCriarAcesso.spinner;
          this.btnCriarAcesso.disabled = !this.btnCriarAcesso.disabled;

          exampleModal.querySelector('button[class="btn-close"]').click();

          this.toastData.header = "Criar Acesso";
          this.toastData.body = "Senha próvisória criada com sucesso!";
          Toast.getOrCreateInstance(
            document.querySelector("#liveToast")
          ).show();
          break;
        default:
          break;
      }
    },
  },
};
</script>
