<template>
  <div class="pageBody m-3">
    <button type="button" class="btn btn-secondary mb-3">
      Salvar Mudanças
    </button>
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
              @click="showModalAddIntent('add')"
            >
              Adicionar Intenção
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary"
              @click="showModalAddIntent('edit')"
            >
              Editar Selecionado
            </button>
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
                    {{
                      createIntent.mode === "add" ? "Adicionar" : "Editar"
                    }}
                    Intenção
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
        </div>
        <div class="card-body">
          <div id="intentsList" class="list-group overflow-y-scroll">
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
          <div class="headerButton">
            <button
              @click="addExampleInput"
              type="button"
              class="btn btn-sm btn-outline-primary"
            >
              Adicionar Exemplo
            </button>
          </div>
        </div>
        <div class="card-body overflow-y-scroll">
          <div
            v-for="(example, index) in nlu.currentIntent.examples"
            :key="index"
            class="input-group mb-3"
          >
            <span class="input-group-text" id="basic-addon1">-</span>
            <input
              type="text"
              class="form-control"
              placeholder="Exemplo"
              aria-label="Exemplo"
              aria-describedby="basic-addon1"
              :value="example"
              @focus="examples.currentExampleIndex = index"
              @keyup.enter="editExample($event)"
            />
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
  </div>
</template>

<script>
import PaginationComponent from "@/components/PaginationComponent.vue";
import BotService from "@/services/ivo/bot/BotService";
import { Modal } from "bootstrap";

export default {
  name: "IntencoesView",
  components: {
    PaginationComponent,
  },
  data() {
    return {
      nlu: {
        intents: [],
        currentIntent: {},
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
      examples: {
        currentExampleIndex: Number,
        currentExample: "",
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
    addIntent() {
      this.createIntent.inputValue = this.createIntent.inputValue.trim();

      if (!this.createIntent.inputValue) return;

      if (this.createIntent.mode === "edit") {
        this.nlu.currentIntent.intent = this.createIntent.inputValue;
        this.createIntent.mode = "add";
        this.createIntent.inputValue = "";
        this.createIntent.modal.hide();
        return;
      }

      this.nlu.intents.push({
        intent: this.createIntent.inputValue,
        examples: [],
      });
      this.createIntent.inputValue = "";
      this.createIntent.modal.hide();
    },
    showModalAddIntent(mode) {
      this.createIntent.mode = mode;

      if (this.createIntent.mode === "edit") {
        this.createIntent.inputValue = this.nlu.currentIntent.intent;
      }

      this.createIntent.modal.show();
    },
    addExampleInput() {
      if (this.nlu.currentIntent.examples.length === 0) {
        this.nlu.currentIntent.examples.push("");
        return;
      }
      if (
        !this.nlu.currentIntent.examples[
          this.nlu.currentIntent.examples.length - 1
        ]
      )
        return;

      this.nlu.currentIntent.examples.push("");
    },
    addExample(event) {
      this.nlu.currentIntent.examples[
        this.nlu.currentIntent.examples.length - 1
      ] = event.target.value.trim();
    },
    editExample(event) {
      console.log('to editando');
      this.nlu.currentIntent.examples[this.examples.currentExampleIndex] =
        event.target.value.trim();
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
  height: calc(100vh - 195px);
}

#intentCard {
  min-width: 50%;
  height: calc(100vh - 195px);
}

#intentsList {
  max-height: calc(100vh - 220px);
}
</style>
