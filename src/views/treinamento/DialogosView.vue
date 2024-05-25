<template>
  <div class="pageBody m-3">
    <div id="dialogosContainer">
      <div id="dialogoCard" class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div class="card-header-actions d-flex align-items-center">
            <button @click="showModalAddDialogo" class="btn btn-sm btn-outline-primary">
              Adicionar Diálogo
            </button>
            <div class="modal fade" id="modalAddDialogo" tabindex="-1" aria-labelledby="exampleModalLabel"
              aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="modalAddDialogoLabel">Criar diálogo</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div class="mb-3">
                      <label for="recipient-name" class="col-form-label">Nome:</label>
                      <input v-model="createDialogo.dialogoName" type="text" class="form-control" id="dialogo-name">
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button @click="addDialogo" type="button" class="btn btn-primary">Confirmar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-body d-flex flex-wrap gap-3 overflow-y-scroll">
          <div v-for="(dialogo, index) in dialogosData.dialogos" :key="index" class="card-body-item">
            <CardDialogoComponent :cardHeader="dialogo.story" :steps="dialogo.steps" :intents="intencoes"
              :responses="responses" :cardIndex="index" @add-step="addStep" @delete-step="deleteStep"
              @save-dialogo="saveDialogo" />
          </div>
        </div>
      </div>
    </div>
    <ToastComponent ref="toastDialogoComponent" :toastData="toast" />
  </div>
</template>

<script>
import CardDialogoComponent from '@/components/CardDialogoComponent.vue';
import ToastComponent from '@/components/ToastComponent.vue';
import router from '@/router';
import BotService from '@/services/ivo/bot/BotService';
import { Modal } from 'bootstrap';

export default {
  name: "DialogosView",
  components: {
    CardDialogoComponent,
    ToastComponent
  },
  data() {
    return {
      dialogosData: {
        dialogos: [],
        currentDialogo: {}
      },
      intencoes: [],
      responses: [],
      toast: {
        header: 'header',
        body: 'body',
        bg: 'bg'
      },
      createDialogo: {
        modal: Object,
        dialogoName: ''
      }
    };
  },
  created() {
    this.getAllStories();
    this.getAllIntentsNames();
    this.getAllResponsesNames();
  },
  mounted() {
    this.createDialogo.modal = new Modal(
      document.querySelector('#modalAddDialogo')
    );
  },
  methods: {
    async getAllStories() {
      const botSerivce = new BotService(),
        response = await botSerivce.getAllStories();

      switch (response.status_code) {
        case 400:
        case 401:
        case 403:
        case 500:
          router.push({ name: 'auth.login' });
          break;
        case 200:
          this.dialogosData.dialogos = response.json.data;
          break;
        default:
          break;
      }
    },
    async getAllIntentsNames() {
      const botService = new BotService(),
        response = await botService.getAllIntentsNames();

      switch (response.status_code) {
        case 200:
          this.intencoes = response.json.data;
          break;
        case 400:
        case 401:
        case 403:
        case 500:
          router.push({ name: 'auth.login' });
          break;
        default:
          break;
      }
    },
    async getAllResponsesNames() {
      const botService = new BotService(),
        response = await botService.getAllResponsesNames();

      switch (response.status_code) {
        case 400:
        case 401:
        case 403:
          router.push({ name: 'auth.login' });
          break;
        case 200:
          this.responses = response.json.data;
          break;
        default:
          break;
      }
    },
    showModalAddDialogo() {
      this.createDialogo.modal.show();
    },
    async addDialogo() {
      if (!this.createDialogo.dialogoName) return;

      const requestBody = {
        story: this.createDialogo.dialogoName,
        steps: []
      };

      this.dialogosData.dialogos.push(requestBody);

      const botService = new BotService(),
        response = await botService.createStory(JSON.stringify({
          data: { ...requestBody }
        }));
      
      switch (response.status_code) {
        case 401:
        case 403:
          router.push({ name: 'auth.login' });
          break;
        case 201:
          this.createDialogo.dialogoName = '';
          this.createDialogo.modal.hide();
          break;
        default:
          break;
      }
    },
    addStep(cardIndex, type) {
      this.dialogosData.dialogos[cardIndex].steps.push({
        [type]: '',
      });
    },
    deleteStep(currentDialogo, stepIndex) {
      this.dialogosData.dialogos[currentDialogo].steps.splice(stepIndex, 1);
    },
    async saveDialogo(cardIndex) {
      const dialogoForSave = { ...this.dialogosData.dialogos[cardIndex] };
      dialogoForSave.steps = dialogoForSave.steps
        .filter(step => Object.values(step).some(value => value !== ''));
      this.dialogosData.dialogos[cardIndex].steps = dialogoForSave.steps;

      const botService = new BotService(),
        response = await botService.editStorySteps(JSON.stringify({
          steps: dialogoForSave.steps
        }), dialogoForSave.story);

      switch (response.status_code) {
        case 401:
        case 403:
          router.push({ name: 'auth.login' });
          break;
        case 200:
          this.toast.header = 'Salvar diálogo';
          this.toast.body = `Diálogo ${dialogoForSave.story} salvo.`;
          this.toast.bg = 'text-bg-success';
          this.$refs.toastDialogoComponent.showToast();
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style scoped>
#dialogoCard {
  height: calc(100vh - 90px);
}

.card-body-item {
  width: 32%;
}
</style>
