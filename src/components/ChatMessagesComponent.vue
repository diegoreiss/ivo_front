<template>
  <div class="w-100">
    <ul id="listMessages" class="pe-4">
      <li v-for="(message, index) in messages" :key="index" :class="{
                                                    sender: message.sender,
                                                    'repaly text-end': !message.sender,
                                                  }" class="d-block w-100 position-relative my-3">
        <div id="message-text" class="fs-6 p-3 lh-base fw-normal d-inline-block rounded message-box-item" :class="{
                                                      'text-dark bg-secondary bg-opacity-10 scale-up-hor-left':
                                                        message.sender,
                                                      'text-light mybg-red bg-opacity-75 scale-up-hor-right':
                                                        !message.sender,
                                                    }">
          <div v-if="message.sender" v-show="message.spinnerLoading" class="spinner-grow spinner-grow-sm text-secondary"
            role="status"></div>
          <span class="message-text-content text-break">{{ message.message }}</span>
        </div>
      </li>
    </ul>
    <div class="send-box p-3 border-top">
      <div action="" class="d-flex gap-3 w-100 align-items-center justify-content-between" autocomplete="off">
        <input v-model="newMessage" class="form-control" type="text" name="inputMessage" id="inputMessage"
          aria-label="mensagem..." placeholder="Escreva uma mensagem..." autocomplete="off" @keyup.enter="sendMessage" />
        <button @click="sendMessage" type="submit" class="btn text-white fs-6 w-25 mybg-red">
          <i class="bi bi-send-plus-fill me-2"></i>
          Enviar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatMessagesComponent',
  data() {
    return {
      newMessage: '',
    };
  },
  props: {
    messages: Array
  },
  emits: [
    'sendMessage'
  ],
  methods: {
    sendMessage() {
      this.$emit('sendMessage', this.newMessage);
    }
  }
}
</script>

<style scoped>
@keyframes scale-up-hor-right {
  0% {
    transform: scaleX(0.4);
    transform-origin: 100% 100%;
  }

  100% {
    transform: scaleX(1);
    transform-origin: 100% 100%;
  }
}

@keyframes scale-up-hor-left {
  0% {
    transform: scaleX(0.4);
    transform-origin: 0% 0%;
  }

  100% {
    transform: scaleX(1);
    transform-origin: 0% 0%;
  }
}

#listMessages {
  height: calc(100vh - 90px);
}

.mybg-red {
  background-color: #da494e !important;
}

#message-text {
  max-width: 50%;
}

.scale-up-hor-right {
  animation: scale-up-hor-right 0.3s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}

.scale-up-hor-left {
  animation: scale-up-hor-left 0.3s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}
</style>
