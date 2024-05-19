<template>
  <div class="pageBody m-3">
    <div id="responsesContainer" class="d-flex">
      <div id="responseCard" class="card me-2">
        <div
          class="card-header d-flex align-items-center justify-content-between"
        >
          <span class="card-header-name">Nome</span>
          <div class="card-actions">
            <button
              class="btn btn-sm btn-outline-primary"
              @click="showModalAddResponse"
            >
              Adicionar Resposta
            </button>
            <div
              class="modal fade"
              id="addResponseModal"
              tabindex="-1"
              aria-labelledby="addResponseModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="addResponseModalLabel">
                      Nova Resposta
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <div class="mb-3">
                      <VueSelect
                        v-model="createResponse.intent"
                        :options="intentsData.intents"
                        placeholder="Escolha uma intenção disponível para responder"
                      >
                        <!-- eslint-disable-next-line vue/no-unused-vars  -->
                        <template #no-options="{ search, searching, loading }">
                          Não encontrado.
                        </template>
                      </VueSelect>
                    </div>
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
                      @click="addResponse"
                      type="button" 
                      class="btn btn-primary">
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-body overflow-y-scroll">
          <div id="responsesList" class="list-group">
            <button
              v-for="(response, index) in responseData.responses"
              :key="index"
              type="button"
              class="list-group-item list-group-item-action"
              :class="{
                'bg-danger text-white': pagination.activeItem === index,
              }"
              @click="gotoResponse(index + 1)"
            >
              {{ response.responseName }}
            </button>
          </div>
        </div>
      </div>

      <div id="responseTextsCard" class="card">
        <div
          class="card-header d-flex align-items-center justify-content-between"
        >
          <span class="card-headerName">{{
            responseData.currentResponse.responseName
          }}</span>
          <div class="d-flex gap-1 justify-content-between align-items-center">
            <button
              @click="addResponseInputText"
              class="btn btn-sm btn-outline-primary"
            >
              Adicionar Campo
            </button>
            <button
              @click="saveChangeResponsesTexts"
              class="btn btn-sm btn-outline-secondary"
            >
              Salvar Mudanças
            </button>
          </div>
        </div>
        <div class="card-body overflow-y-scroll">
          <div
            v-for="(text, index) in responseData.currentResponse.texts"
            :key="index"
            class="inputExample d-flex gap-2 align-items-center justify-content-between"
          >
            <div class="mb-3 w-100">
              <textarea
                class="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
                :value="text.text"
                placeholder="Texto"
                @input="editResponseText($event, index)"
              ></textarea>
            </div>
            <button
              type="button"
              class="btn-close mt-2"
              aria-label="Close"
              @click="deleteResponseText(index)"
            ></button>
          </div>
        </div>
      </div>
    </div>
    <div id="responsesPagination" class="mt-3">
      <PaginationComponent
        :total-pages="responseData.totalPages"
        :current-page="pagination.currentPage"
        :item-per-page="3"
        @onPageChange="pageChange"
      />
    </div>
    <ToastComponent ref="toastRespostasComponent" :toastData="toast" />
  </div>
</template>

<script>
import BotService from "@/services/ivo/bot/BotService";
import PaginationComponent from "@/components/PaginationComponent.vue";
import ToastComponent from "@/components/ToastComponent.vue";
import { Modal } from "bootstrap";
import VueSelect from "vue-select";
import router from "@/router";

export default {
  name: "RespostasView",
  components: {
    PaginationComponent,
    VueSelect,
    ToastComponent
  },
  data() {
    return {
      responseData: {
        totalPages: 0,
        responses: [],
        currentResponse: {},
      },
      intentsData: {
        intents: [],
      },
      pagination: {
        activeItem: 0,
        pages: 0,
        currentPage: 1,
      },
      createResponse: {
        modal: Object,
        intent: '',
      },
      toast: {
        header: 'header',
        body: 'body',
        bg: 'bg'
      }
    };
  },
  created() {
    this.getAllResponses();
  },
  mounted() {
    this.createResponse.modal = new Modal(
      document.querySelector("#addResponseModal")
    );
  },
  methods: {
    async getAllResponses() {
      const botService = new BotService(),
        response = await botService.getAllResponses(
          this.pagination.currentPage
        );

      this.responseData.totalPages = response.json.total_pages;

      const array = new Array();

      Object.entries(response.json.responses).forEach((value) => {
        array.push({
          responseName: value[0],
          texts: value[1],
        });
      });

      this.responseData.responses = array;
      this.responseData.currentResponse =
        this.responseData.responses[this.pagination.activeItem];
    },
    async getAllAvailableIntentsNames() {
      const botService = new BotService(),
        response = await botService.getAllAvailalbeIntentsNames();

      this.intentsData.intents = response.json.data;
    },
    gotoResponse(number) {
      this.pagination.activeItem = number - 1;
      this.responseData.currentResponse =
        this.responseData.responses[number - 1];
    },
    pageChange(number) {
      this.pagination.currentPage = number;
      this.pagination.activeItem = 0;
      this.getAllResponses();
    },
    addResponseInputText() {
      console.log("make things");
      console.log(this.responseData.currentResponse.texts);
      this.responseData.currentResponse.texts.push({
        text: "",
      });
    },
    editResponseText(event, index) {
      this.responseData.currentResponse.texts[index].text = event.target.value;
    },
    deleteResponseText(index) {
      this.responseData.currentResponse.texts.splice(index, 1);
    },
    showModalAddResponse() {
      this.createResponse.intent = '';
      this.getAllAvailableIntentsNames();
      this.createResponse.modal.show();
    },
    async addResponse() {
      if (!this.createResponse.intent) return;

      const response = {
        responseName: `utter_${this.createResponse.intent}`,
        texts: [
          {'text': ''}
        ]
      },
      botService = new BotService(),
      res = botService.createResponse(JSON.stringify({
        [response.responseName]: response.texts
      }));

      console.log(res.status);
      this.responseData.responses.push(response);

      this.createResponse.modal.hide();
    },
    async saveChangeResponsesTexts() {
      this.responseData.currentResponse.texts = this.responseData.currentResponse.texts.filter(t => t.text.trim() !== '');
      this.responseData.currentResponse.texts.forEach(t => { t.text = t.text.trim() });

      const texts = [ ...this.responseData.currentResponse.texts ];

      const botService = new BotService(),
        response = await botService.editResponseTexts(JSON.stringify({
          texts: texts
        }), this.responseData.currentResponse.responseName);

      switch (response.status_code) {
        case 200:
          this.toast.header = 'Salvar Mudanças';
          this.toast.body = 'Alterações realizadas.';
          this.toast.bg = 'text-bg-success';
          this.$refs.toastRespostasComponent.showToast();
          break;
        case 401:
        case 403:
        case 500:
          router.push({ name: 'auth.login' });
          break;
        default:
          router.push({ name: 'auth.login' });
          break;
      }
    }
  },
};
</script>

<style>
:root,
:host {
  --vs-dropdown-option--active-bg: #f00 !important;
}

.vs__dropdown-option--highlight {
  background: #f00 !important;
  color: #fff !important;
}
</style>

<style scoped>
@import "vue-select/dist/vue-select.css";

#responseTextsCard {
  min-width: 50%;
}

#responseCard,
#responseTextsCard {
  height: calc(100vh - 145px);
}

#responseCard {
  min-width: 50%;
}
</style>
