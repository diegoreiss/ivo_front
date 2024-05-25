<template>
  <section class="message-area">
    <div class="chat-area">
      <div class="chat-box">
        <div class="modal-dialog-scrollable">
          <div class="modal-content">
            <div class="msg-head border-bottom pt-4 px-4">
              <div class="row d-flex align-items-center">
                <div class="col-8">
                  <div class="flex-grow-1 ms-3">
                    <h3>I.V.O Chat</h3>
                    <p>Bot</p>
                  </div>
                </div>
                <div class="col-4">
                  <div
                    class="moreoption d-flex align-items-center justify-content-end"
                  >
                    <div class="navbar nav-item dropdown dropstart">
                      <button
                        class="nav-link mb-3"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i class="bi bi-list h2"></i>
                      </button>
                      <ul class="dropdown-menu">
                        <li>
                          <button class="dropdown-item">Sair do Chat</button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="modalMensagens" class="modal-body" v-chat-scroll>
              <div class="msg-body">
                <ul id="listMessages" class="pe-4">
                  <li
                    v-for="(message, index) in messages"
                    :key="index"
                    :class="{
                      sender: message.sender,
                      'repaly text-end': !message.sender,
                    }"
                    class="d-block w-100 position-relative my-3"
                  >
                    <div
                      id="message-text"
                      class="fs-6 p-3 lh-base fw-normal d-inline-block rounded message-box-item"
                      :class="{
                        'text-dark bg-secondary bg-opacity-10 scale-up-hor-left':
                          message.sender,
                        'text-light mybg-red bg-opacity-75 scale-up-hor-right':
                          !message.sender,
                      }"
                    >
                      <div
                        v-if="message.sender"
                        v-show="message.spinnerLoading"
                        class="spinner-grow spinner-grow-sm text-secondary"
                        role="status"
                      ></div>
                      <span class="message-text-content text-break">{{ message.content }}</span>
                    </div>
                    <div v-if="message.buttons" class="mt-2">
                      <div class="button-options-container d-flex justify-content-start align-items-center gap-3">
                        <button 
                          @click="escolherOpcaoBot(button.payload)"
                          v-for="(button, index) in message.buttons" 
                          :key="index" 
                          class="btn btn-sm btn-secondary"
                        >
                          {{ button.title }}
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="send-box p-3 border-top">
              <div
                @click="sendMessage()"
                action=""
                class="d-flex gap-3 w-100 align-items-center justify-content-between"
                autocomplete="off"
              >
                <input
                  v-model="newMessage"
                  class="form-control"
                  type="text"
                  name="inputMessage"
                  id="inputMessage"
                  aria-label="mensagem..."
                  placeholder="Escreva uma mensagem..."
                  autocomplete="off"
                  :disabled="!formMessage.enabled"
                  @keyup.enter="sendMessage()"
                />
                <button
                  :disabled="!formMessage.enabled"
                  type="submit"
                  class="btn text-white fs-6 w-25 mybg-red"
                >
                  <i class="bi bi-send-plus-fill me-2"></i>
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BotService from "@/services/ivo/bot/BotService";

export default {
  name: "ChatView",
  data() {
    return {
      formMessage: {
        enabled: true,
      },
      messages: [],
      newMessage: "",
      chatSocket: null,
    };
  },
  mounted() {
    console.log(window.location.host);
    this.chatSocket = new WebSocket(`ws://localhost:8000/ws/chat/${this.userUuid}/`);

    this.chatSocket.onopen = () => {
      console.info('Websocket connection opened :)');
    };

    this.chatSocket.onclose = () => {
      console.info('Websocket Closed');
    };

    this.chatSocket.oneerror = (error) => {
      console.error(`Websocket error >>: ${error}`);
    };
  },
  beforeRouteLeave() {
    if (this.chatSocket) {
      this.chatSocket.close();
      this.chatSocket = null;
    }
  },
  props: {
    userUuid: String,
  },
  methods: {
    getLastMessage() {
      return this.messages[this.messages.length - 1];
    },
    async sendMessage() {
      if (!this.newMessage) return;

      this.messages.push({
        content: this.newMessage,
        sender: false,
      });

      this.messages.push({
        content: "",
        sender: true,
        spinnerLoading: true,
      });

      this.formMessage.enabled = false;
      const lastMessage = this.getLastMessage(),
        botService = new BotService(),
        response = await botService.sendMessageToBot(
          JSON.stringify({
            sender: `user_${this.userUuid}`,
            message: this.newMessage,
          })
        );
      
      console.log(response);

      response.json.forEach((message, index) => {
        if (index === 0) {
          if (message.buttons) {
            lastMessage['buttons'] = message.buttons;
            this.formMessage.enabled = false;
          }
          lastMessage.content = message.text;

        } else {
          const botMessage = {
            content: message.text,
            sender: true
          }

          this.messages.push(botMessage);
        }
      });

      this.newMessage = "";
      lastMessage.spinnerLoading = false;
      this.formMessage.enabled = true;
    },
    escolherOpcaoBot(opcao) {
      console.log('cliquei');
      console.log(opcao);
      this.newMessage = opcao;
      this.sendMessage();
    }
  },
};
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

#message-text {
  max-width: 50%;
}

.msg-body {
  height: calc(100vh - 200px);
}

.mybg-red {
  background-color: #da494e !important;
}

.scale-up-hor-right {
  animation: scale-up-hor-right 0.3s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}

.scale-up-hor-left {
  animation: scale-up-hor-left 0.3s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}
</style>
