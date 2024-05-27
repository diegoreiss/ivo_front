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
                  <div class="moreoption d-flex align-items-center justify-content-end">
                    <div class="navbar nav-item dropdown dropstart">
                      <button class="nav-link mb-3" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-list h2"></i>
                      </button>
                      <ul class="dropdown-menu">
                        <li>
                          <button class="dropdown-item">Sair do Chat</button>
                        </li>
                        <li>
                          <button @click="showModalClearChatHistory" :disabled="messages.length <= 0"
                            class="dropdown-item">Limpar Conversa</button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal fade" id="modalConfirmClearHistory" tabindex="-1" aria-labelledby="exampleModalLabel"
              aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="modalConfirmClearHistoryLabel">Deseja limpar o histórico?</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" v-model="clearHistory.wantHistoryChat" role="switch"
                        id="flexSwitchCheckChecked" checked>
                      <label class="form-check-label" for="flexSwitchCheckChecked">Desejo também o histórico do chat após
                        a limpeza</label>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Não, mudei de ideia</button>
                    <button @click="clearChatHistory" type="button" class="btn btn-primary">Sim, desejo limpar o
                      histórico</button>
                  </div>
                </div>
              </div>
            </div>
            <div id="modalMensagens" class="modal-body" v-chat-scroll>
              <div class="msg-body">
                <ul id="listMessages" class="pe-4">
                  <li v-for="(message, index) in messages" :key="index" :class="{
                                            sender: message.sender,
                                            'repaly text-end': !message.sender,
                                          }" class="d-block w-100 position-relative my-3">
                    <div id="message-text" class="fs-6 p-3 lh-base fw-normal d-inline-block rounded message-box-item"
                      :class="{
                                              'text-dark bg-secondary bg-opacity-10 scale-up-hor-left':
                                                message.sender,
                                              'text-light mybg-red bg-opacity-75 scale-up-hor-right':
                                                !message.sender,
                                            }">
                      <div v-if="message.sender" v-show="message.spinnerLoading"
                        class="spinner-grow spinner-grow-sm text-secondary" role="status"></div>
                      <span class="message-text-content text-break">{{ message.message}}</span>
                    </div>
                    <div v-if="message.data.buttons" class="mt-2">
                      <div class="button-options-container d-flex justify-content-start align-items-center gap-3">
                        <button @click="escolherOpcaoBot(button.payload)" v-for="(button, index) in message.data.buttons"
                          :key="index" class="btn btn-sm btn-secondary">
                          {{ button.title }}
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="send-box p-3 border-top">
              <div action="" class="d-flex gap-3 w-100 align-items-center justify-content-between" autocomplete="off">
                <input v-model="newMessage" class="form-control" type="text" name="inputMessage" id="inputMessage"
                  aria-label="mensagem..." placeholder="Escreva uma mensagem..." autocomplete="off"
                  :disabled="!formMessage.enabled" @keyup.enter="sendMessage" />
                <button @click="sendMessage" :disabled="!formMessage.enabled" type="submit" class="btn text-white fs-6 w-25 mybg-red">
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
import router from "@/router";
import BotService from "@/services/ivo/bot/BotService";
import ChatService from "@/services/ivo/chat/ChatService";
import { Modal } from "bootstrap";

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
      clearHistory: {
        modal: null,
        wantHistoryChat: true,
      }
    };
  },
  created() {
    this.chatSocket = new WebSocket(`${process.env.VUE_APP_IVO_WEBSOCKET_URL}/chat/${this.userUuid}/`);

    this.chatSocket.onopen = function () {
      console.info('Websocket connection opened :)');
    };

    this.chatSocket.onmessage = function (e) {
      console.log(e.data);
    }

    this.chatSocket.onclose = function () {
      console.info('Websocket Closed');
    };

    this.chatSocket.oneerror = function (error) {
      console.error(`Websocket error >>: ${error}`);
    };

    this.getChatHistory();
  },
  mounted() {
    this.clearHistory.modal = new Modal(document.querySelector('#modalConfirmClearHistory'));
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
    showModalClearChatHistory() {
      this.clearHistory.modal.show();
    },
    async clearChatHistory() {
      const dom = document.querySelector('#modalMensagens').innerHTML;
      const chatHistoryHtml = `
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            <style>
              #message-text {
                max-width: 50%;
              }

              .msg-body {
                height: calc(100vh - 200px);
              }

              .mybg-red {
                background-color: #da494e !important;
              }
            </style>
          </head>
          <body>
            ${dom}
          </body>
        </html>
      `;

      const chatService = new ChatService(),
        response = await chatService.deleteChatHistory(this.userUuid);

      switch (response.status_code) {
        case 401:
        case 403:
          router.push({ name: 'auth.login' });
          break;
        case 200:
          this.messages = [];
          break;
        default:
          break;
      }

      if (this.clearHistory.wantHistoryChat) {
        let historyChatWindow = window.open('', '', 'height=400, width=600');
        historyChatWindow.document.write(chatHistoryHtml);
        historyChatWindow.document.close();
        historyChatWindow.focus();
        historyChatWindow.print();
        historyChatWindow.close();
      }

      this.clearHistory.modal.hide();
    },
    async getChatHistory() {
      const chatService = new ChatService(),
        response = await chatService.getChatHistory(this.userUuid);

      switch (response.status_code) {
        case 401:
        case 403:
          router.push({ name: 'auth.login' });
          break;
        case 200:
          this.messages = response.json;
          break
        default:
          break;
      }
      console.log(response);
    },
    getLastMessage() {
      return this.messages[this.messages.length - 1];
    },
    async sendMessage() {
      if (!this.chatSocket) return;
      if (!this.newMessage) return;

      const userMessageData = {
        timestamp: new Date().getTime(),
        sender: false,
        spinnerLoading: false,
        bot_should_respond: true,
        type: 'chat_user_message',
        message: this.newMessage,
        data: {
          elements: null,
          quick_replies: null,
          buttons: null,
          attachment: null,
          image: null,
          custom: null
        }
      },
        botMessageData = {
          timestamp: null,
          sender: true,
          spinnerLoading: true,
          bot_should_respond: true,
          type: 'chat_bot_message',
          message: '',
          data: {
            elements: null,
            quick_replies: null,
            buttons: null,
            attachment: null,
            image: null,
            custom: null
          }
        };

      const botMessagesArray = new Array();

      this.messages.push(userMessageData);
      this.chatSocket.send(JSON.stringify(userMessageData));
      this.messages.push(botMessageData);
      botMessagesArray.push(botMessageData);

      this.formMessage.enabled = false;
      const lastMessage = this.getLastMessage(),
        botService = new BotService(),
        response = await botService.sendMessageToBot(
          JSON.stringify({
            sender: `user_${this.userUuid}`,
            message: this.newMessage,
          })
        );

      response.json.forEach((message, index) => {
        if (index === 0) {
          if (message.buttons) {
            lastMessage.data.buttons = message.buttons;
            this.formMessage.enabled = false;
          }

          lastMessage.timestamp = new Date().getTime();
          lastMessage.message = message.text;
        } else {
          const botOtherMessages = {
            timestamp: new Date().getTime(),
            sender: true,
            spinnerLoading: false,
            bot_should_respond: true,
            type: 'chat_bot_message',
            message: message.text,
            data: {
              elements: null,
              quick_replies: null,
              buttons: null,
              attachment: null,
              image: null,
              custom: null
            }
          };

          this.messages.push(botOtherMessages);
          botMessagesArray.push(botOtherMessages);
        }
      });

      this.newMessage = "";
      lastMessage.spinnerLoading = false;
      this.formMessage.enabled = true;

      botMessagesArray.forEach(m => this.chatSocket.send(JSON.stringify(m)));
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
