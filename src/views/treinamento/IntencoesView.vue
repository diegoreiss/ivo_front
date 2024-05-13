<template>
  <div class="pageBody m-3">
    <div id="intentContainer" class="d-flex">
      <div id="intentCard" class="card me-2">
        <div
          class="card-header d-flex align-items-center justify-content-between"
        >
          <span class="headerName">Nome</span>
          <div class="headerButton d-flex gap-1">
            <button
              type="button"
              class="btn btn-sm btn-outline-primary"
              @click="showModalAddIntent"
            >
              Adicionar Intenção
            </button>
            <!-- <button
              type="button"
              class="btn btn-sm btn-outline-secondary"
              @click="showModalEditIntent"
            >
              Editar Selecionado
            </button> -->
          </div>
          <div
            class="modal fade"
            id="modalAddIntent"
            tabindex="-1"
            aria-labelledby="modalAddIntentLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="modalAddIntentLabel">
                    Adicionar Intenção
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
                    <label for="recipient-name" class="col-form-label"
                      >Nome:</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      v-model="createIntent.inputValue"
                    />
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
                    @click="addIntent"
                    type="button"
                    class="btn btn-primary"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            class="modal fade"
            id="modalEditIntent"
            tabindex="-1"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
                    Editar Intenção
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
                    <label for="intent-name" class="col-form-label"
                      >Nome:</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="intent-name"
                      v-model="editIntentObj.inputValue"
                    />
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
                    @click="editIntent"
                    type="button"
                    class="btn btn-primary"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-body overflow-y-scroll">
          <div id="intentsList" class="list-group">
            <button
              v-for="(intent, index) in this.nlu.intents"
              :key="index"
              type="button"
              class="list-group-item list-group-item-action"
              :class="{
                'bg-danger text-white': pagination.activeItem === index,
              }"
              @click="gotoIntent(index + 1)"
            >
              {{ intent.intent }}
            </button>
          </div>
        </div>
      </div>
      <div id="intentExamplesCard" class="card">
        <div
          class="card-header d-flex align-items-center justify-content-between"
        >
          <span class="headerName">
            {{ nlu.currentIntent.intent }}
          </span>
          <div class="headerButton d-flex gap-1">
            <button
              @click="addExampleInput"
              type="button"
              class="btn btn-sm btn-outline-primary"
            >
              Adicionar Exemplo
            </button>
            <button
              @click="saveChangesExamples"
              type="button"
              class="btn btn-sm btn-outline-secondary"
            >
              Salvar Mudanças
            </button>
          </div>
        </div>
        <div class="card-body overflow-y-scroll">
          <div
            v-for="(example, index) in nlu.currentIntent.examples"
            :key="index"
            class="inputExample d-flex gap-2"
          >
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon1">-</span>
              <input
                type="text"
                class="form-control"
                placeholder="Exemplo"
                aria-label="Exemplo"
                aria-describedby="basic-addon1"
                :value="example"
                @focus="examples.currentExampleIndex = index"
                @input="editExample($event, index)"
              />
            </div>
            <button
              @click="deleteExample(index)"
              type="button"
              class="btn-close mt-2"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </div>
    <div id="intentsPagination" class="mt-3">
      <PaginationComponent
        :totalPages="pagination.pages"
        :currentPage="pagination.current"
        :itemPerPage="3"
        @onPageChange="changePage"
      />
    </div>
    <ToastComponent ref="toastComponent" :toastData="toast" />
  </div>
</template>

<script>
import PaginationComponent from "@/components/PaginationComponent.vue";
import BotService from "@/services/ivo/bot/BotService";
import { Modal } from "bootstrap";
import ToastComponent from "@/components/ToastComponent.vue";

export default {
  name: "IntencoesView",
  components: {
    PaginationComponent,
    ToastComponent,
  },
  data() {
    return {
      nlu: {
        intents: [],
        currentIntent: {},
        intentsCreated: [],
        intentsEdited: [],
      },
      pagination: {
        activeItem: 0,
        pages: 0,
        current: 1,
      },
      createIntent: {
        inputValue: "",
        modal: Object,
        mode: "add",
      },
      editIntentObj: {
        inputValue: "",
        modal: Object,
      },
      examples: {
        currentExampleIndex: Number,
        currentExample: "",
      },
      toast: {
        header: "header",
        body: "body",
        bg: "bg",
      },
    };
  },
  created() {
    this.getAllIntents();
  },
  mounted() {
    this.createIntent.modal = new Modal(
      document.querySelector("#modalAddIntent")
    );
    this.editIntentObj.modal = new Modal(
      document.querySelector("#modalEditIntent")
    );
  },
  methods: {
    gotoIntent(number) {
      this.pagination.activeItem = number - 1;
      this.nlu.currentIntent = this.nlu.intents[number - 1];
    },
    async getAllIntents() {
      const botService = new BotService(),
        res = await botService.getAllIntents(this.pagination.current);
      this.nlu.intents = res.json.nlu.intents;
      this.pagination.pages = res.json.total_pages;

      this.nlu.intents.forEach((intent) => {
        intent.examples = intent.examples
          .split("\n")
          .map((example) => example.replace(/^- /, ""))
          .map((example) => example.trim());
      });

      this.gotoIntent(1);
    },
    changePage(number) {
      this.pagination.current = number;
      this.pagination.activeItem = 0;
      this.getAllIntents();
    },
    async addIntent() {
      this.createIntent.inputValue = this.createIntent.inputValue.trim();
      const botService = new BotService(),
        intent = await botService.getIntentByName(this.createIntent.inputValue);

      if (intent.status_code === 200) {
        this.createIntent.inputValue = "";
        this.createIntent.modal.hide();
        this.toast.header = "Adicionar Intenção";
        this.toast.body = "Essa inteção já existe!";
        this.toast.bg = "text-bg-danger";
        this.$refs.toastComponent.showToast();
        return;
      }

      if (!this.createIntent.inputValue) return;

      const newIntent = {
        intent: this.createIntent.inputValue,
        examples: [],
      };

      this.nlu.intents.push(newIntent);
      this.nlu.intentsCreated.push(newIntent);
      this.createIntent.inputValue = "";
      this.createIntent.modal.hide();

      console.log("chamada api");

      const newIntentCopy = { ...newIntent };
      newIntentCopy.examples = newIntentCopy.examples.join("\n");

      const response = await botService.createIntent(
        JSON.stringify(newIntentCopy)
      );
      console.log(response.json);
    },
    async editIntent() {
      this.editIntentObj.inputValue = this.editIntentObj.inputValue.trim();
      const intent = await this.getIntentByName(this.editIntentObj.inputValue);

      if (intent.status_code === 200) {
        this.editIntentObj.modal.hide();
        this.toast.header = "Editar Intenção";
        this.toast.body = "Essa inteção já existe!";
        this.toast.bg = "text-bg-danger";
        this.$refs.toastComponent.showToast();
        return;
      }

      this.nlu.currentIntent.intent = this.editIntentObj.inputValue;
      this.editIntentObj.modal.hide();
    },
    showModalAddIntent() {
      this.createIntent.modal.show();
    },
    showModalEditIntent() {
      this.editIntentObj.inputValue = this.nlu.currentIntent.intent;
      this.editIntentObj.modal.show();
    },
    addExampleInput() {
      this.nlu.currentIntent.examples.push("");
    },
    editExample(event, index) {
      this.nlu.currentIntent.examples[index] = event.target.value.trim();
    },
    deleteExample(index) {
      this.nlu.currentIntent.examples.splice(index, 1);
    },
    async saveChangesExamples() {
      const currentIntentCopy = { ...this.nlu.currentIntent };
      currentIntentCopy.examples = currentIntentCopy.examples
        .filter((e) => e !== "")
        .map((e) => e.trim());

      const examplesJoined =
          currentIntentCopy.examples.map((e) => `- ${e}`).join("\n") + "\n",
        body = JSON.stringify({
          examples: examplesJoined,
        }),
        botService = new BotService(),
        response = await botService.editIntentExamples(body, currentIntentCopy.intent);

      console.log(response);

      this.nlu.currentIntent.examples = currentIntentCopy.examples;
    },
  },
};
</script>

<style scoped>
.pageBody {
  height: calc(100vh - 76px);
}

#intentExamplesCard {
  min-width: 49%;
  height: calc(100vh - 145px);
}

#intentCard {
  min-width: 50%;
  height: calc(100vh - 145px);
}

#intentsList {
  max-height: calc(100vh - 220px);
}
</style>
