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
            <div class="modal-body overflow-y-auto">
              <div class="msg-body">
                <ul class="pe-4">
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
                      class="fs-6 p-3 lh-base fw-normal d-inline-block rounded"
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
                  </li>
                </ul>
              </div>
            </div>
            <div class="send-box p-3 border-top">
              <form
                @submit="sendMessage($event)"
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
                  :disabled="!formMessage.enabled"
                />
                <button
                  :disabled="!formMessage.enabled"
                  type="submit"
                  class="btn text-white fs-6 w-25 mybg-red"
                >
                  <i class="bi bi-send-plus-fill me-2"></i>
                  Enviar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import RasaRestService from "@/services/rasa/rest/RasaRestService";

export default {
  name: "ChatView",
  data() {
    return {
      formMessage: {
        enabled: true,
      },
      messages: [
        {
          type: "chatbot",
          content: "Oi eu sou o ivo",
          sender: true,
          spinnerLoading: false,
        },
        { type: "chatbot", content: "Bom dia!", sender: false },
      ],
      newMessage: "",
    };
  },
  props: {
    userUuid: String,
  },
  methods: {
    getLastMessage() {
      return this.messages[this.messages.length - 1];
    },
    async sendMessage(event) {
      event.preventDefault();
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
        rasaRestService = new RasaRestService(),
        response = await rasaRestService.restInput(
          JSON.stringify({
            sender: `user_${this.userUuid}`,
            message: this.newMessage,
          })
        );

      response.json.forEach((message, index) => {
        if (index === 0) {
          lastMessage.content = message.text;
        } else {
          this.messages.push({
            content: message.text,
            sender: true,
          })
        }
      });

      this.newMessage = "";
      lastMessage.spinnerLoading = false;
      this.formMessage.enabled = true;
    },
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
