<template>
  <div id="cardItemDialogo" class="card">
    <div class="card-header d-flex align-items-center justify-content-between overflow-x-scroll">
      <span>{{ cardHeader }}</span>
      <div class="card-header-options d-flex gap-2">
        <button @click="saveDialogo(cardIndex)" class="btn btn-sm btn-outline-primary" :disabled="disabled">
          <i class="bi bi-floppy"></i>
        </button>
        <button @click="toggleEdit(cardIndex)" class="btn btn-sm"
          :class="{ 'btn-outline-primary': disabled, 'btn-outline-secondary': !disabled }">
          <i class="bi" :class="{ 'bi-pencil-square': disabled, 'bi-ban': !disabled }"></i>
        </button>
      </div>
    </div>
    <div id="cardBodyDialogo" class="card-body overflow-y-scroll" :class="{ 'opacity-50': disabled }">
      <div v-for="(step, stepIndex) in steps" :key="stepIndex" class="card-body-item">
        <div v-if="step.intent === '' || step.intent" class="input-group mb-2">
          <label class="input-group-text">Intenção</label>
          <select class="form-select" aria-label="Default select example" v-model="step.intent" :disabled="disabled">
            <option v-if="step.intent === ''" value="" selected>Escolha sua intenção</option>
            <option v-for="(intent, intentIndex) in intents" :key="intentIndex" :value="intent" :selected="intent === step.intent">
              <span>{{ intent }}</span>
            </option>
          </select>
          <button class="btn btn-outline-danger" :disabled="disabled" @click="deleteStep(stepIndex)">
            <i class="bi bi-trash"></i>
          </button>
        </div>
        <div v-if="step.action === '' || step.action" class="input-group mb-2">
          <label class="input-group-text">Ação/Resposta</label>
          <select class="form-select" aria-label="Default select example" v-model="step.action" :disabled="disabled">
            <option value="" v-if="step.action === ''">Escolha sua resposta</option>
            <option v-for="(response, responseIndex) in responses" :key="responseIndex" :value="response"
              :selected="response === step.action">
              <span>{{ response }}</span>
            </option>
          </select>
          <button class="btn btn-outline-danger" :disabled="disabled" @click="deleteStep(stepIndex)">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="card-footer text-body-secondary">
      <div class="card-footer-actions d-flex gap-2 align-items-center justify-content-end">
        <button :disabled="disabled" @click="addStep(cardIndex, 'intent')" class="btn btn-sm btn-outline-primary">Adicionar Intenção</button>
        <button :disabled="disabled" @click="addStep(cardIndex, 'action')" class="btn btn-sm btn-outline-secondary">Adicionar Acão/Resposta</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardDialogoComponent",
  props: {
    cardHeader: String,
    cardIndex: Number,
    steps: Array,
    intents: Array,
    responses: Array
  },
  emits: [
    'addStep',
    'deleteStep',
    'saveDialogo'
  ],
  data() {
    return {
      disabled: true,
      currentDialogo: 0,
    }
  },
  mounted() {
  },
  methods: {
    toggleEdit(index) {
      this.disabled = !this.disabled;
      this.currentDialogo = index;
    },
    addStep(cardIndex, type) {
      this.$emit('addStep', cardIndex, type);
    },
    deleteStep(stepIndex) {
      this.$emit('deleteStep', this.currentDialogo, stepIndex)
    },
    onChangeIntentSelect() {
      console.log(this.steps);
    },
    saveDialogo(cardIndex) {
      this.$emit('saveDialogo', cardIndex);
    }
  }
};
</script>

<style scoped>
#cardBodyDialogo {
  min-height: 260px;
  max-height: 260px;
}
</style>
