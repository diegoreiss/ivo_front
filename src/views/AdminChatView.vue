<template>
  <div class="pageBody">
    <div class="d-flex">
      <div class="d-flex flex-column align-items-stretch flex-shrink-0 bg-body-tertiary" style="width: 380px;">
        <span class="d-flex align-items-center flex-shrink-0 p-3 link-body-emphasis text-decoration-none border-bottom">
          <span class="fs-5 fw-semibold">Usuários</span>
        </span>
        <div class="list-group list-group-flush border-bottom scrollarea overflow-y-scroll usersList">
          <button @click="gotoUserRoom(user.room_name, index)" v-for="(user, index) in users" :key="index"
            class="list-group-item list-group-item-action py-3 lh-sm border"
            :class="{ 'mybg-red text-white' : index === selectedUserIndex }">
            <div class="d-flex w-100 align-items-center justify-content-between">
              <strong class="mb-1">{{ user.first_name }} {{ user.last_name }}</strong>
            </div>
            <div class="col-10 mb-1 small">Clique para entrar na sala</div>
          </button>
        </div>
      </div>
      <div class="w-100 msg-body modal-body">
        <div class="modalMensagens overflow-y-scroll" v-chat-scroll>
          <ul id="listMessages" class="pe-4">
            <li v-for="(message, index) in selectedUserMessages" :key="index" :class="{
                                                                      sender: message.user !== this.userUuid,
                                                                      'repaly text-end': message.user === this.userUuid,
                                                                    }" class="d-block w-100 position-relative my-3">
              <div id="message-text" class="fs-6 p-3 lh-base fw-normal d-inline-block rounded message-box-item" :class="{
                                                                        'text-dark bg-secondary bg-opacity-10 scale-up-hor-left':
                                                                          message.user !== this.userUuid,
                                                                        'text-light mybg-red bg-opacity-75 scale-up-hor-right':
                                                                          message.user === this.userUuid,
                                                                      }">
                <div class="d-flex flex-column">
                  <span class="mb-3 opacity-50">{{ message.title }}</span>
                  <span class="message-text-content text-break">{{ message.message }}</span>
                </div>
                <div v-if="message.sender" v-show="message.spinnerLoading"
                  class="spinner-grow spinner-grow-sm text-secondary" role="status"></div>
              </div>
            </li>
          </ul>
        </div>
        <div class="send-box p-3 border-top">
          <div action="" class="d-flex gap-3 w-100 align-items-center justify-content-between" autocomplete="off">
            <input v-model="newMessage" class="form-control" type="text" name="inputMessage" id="inputMessage"
              aria-label="mensagem..." placeholder="Escreva uma mensagem..." autocomplete="off"
              @keyup.enter="sendMessage" />
            <button @click="sendMessage" type="submit" class="btn text-white fs-6 w-25 mybg-red">
              <i class="bi bi-send-plus-fill me-2"></i>
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatService from '@/services/ivo/chat/ChatService';

export default {
  name: 'AdminChatView',
  data() {
    return {
      users: [],
      selectedUserIndex: -1,
      selectedUserMessages: [],
      selectedUserRoomWebSocket: null,
      usersWebSocket: null,
      newMessage: ''
    };
  },
  props: {
    userUuid: String,
  },
  created() {
    this.connectToUsersWebsocket()
  },
  beforeRouteLeave() {
    if (!this.usersWebSocket) return;

    this.usersWebSocket.close();
    this.usersWebSocket = null;

    this.exitRoomWebSocket();
  },
  methods: {
    connectToUsersWebsocket() {
      this.usersWebSocket = new WebSocket(`${process.env.VUE_APP_IVO_WEBSOCKET_URL}/users/`);

      this.usersWebSocket.onopen = function () {
        console.log('users websocket connection opened');
      };

      this.usersWebSocket.onmessage = (e) => {
        const message = JSON.parse(e.data);

        if (message.message.length === 0) {
          this.users.length = 0;
          return;
        }

        this.users.length = 0;
        message.message.forEach(m => {
          this.users.push(m);
        });
      };

      this.usersWebSocket.onclose = function () {
        console.log('users websocket connection closed.');
      };

      this.usersWebSocket.onerror = function (error) {
        console.error(`users websocket error >>: ${error}`);
      };
    },
    connectToUserRoomWebSocket(roomName) {
      this.exitRoomWebSocket();
      this.selectedUserRoomWebSocket = new WebSocket(`${process.env.VUE_APP_IVO_WEBSOCKET_URL}/chat/${roomName}/`);

      this.selectedUserRoomWebSocket.onopen = () => {
        console.log('user room websocket connection opened');

        const userMessageData = {
          user: this.userUuid,
          title: 'Aviso',
          timestamp: new Date().getTime(),
          sender: false,
          spinnerLoading: false,
          bot_should_respond: false,
          type: 'chat_user_admin_message',
          message: 'Um Coordenador entrou na sala, o bot será desativado até a saída do mesmo.',
          data: {
            elements: null,
            quick_replies: null,
            buttons: null,
            attachment: null,
            image: null,
            custom: null
          }
        };

        this.selectedUserRoomWebSocket.send(JSON.stringify(userMessageData));
      };

      this.selectedUserRoomWebSocket.onmessage = (e) => {
        const message = JSON.parse(e.data);
        this.selectedUserMessages.push(message.message);
      };

      this.selectedUserRoomWebSocket.onclose = () => {
        console.log('user room websocket connection closed.');
      };

      this.selectedUserRoomWebSocket.onerror = function (error) {
        console.error(`user room websocker error >>: ${error}`);
      };
    },
    exitRoomWebSocket() {
      if (!this.selectedUserRoomWebSocket) return;

      const userMessageData = {
        user: this.userUuid,
        title: 'Aviso',
        timestamp: new Date().getTime(),
        sender: false,
        spinnerLoading: false,
        bot_should_respond: true,
        type: 'chat_user_admin_message',
        message: 'O Coordenador saiu da sala, o bot será reativado.',
        data: {
          elements: null,
          quick_replies: null,
          buttons: null,
          attachment: null,
          image: null,
          custom: null
        }
      };

      this.selectedUserRoomWebSocket.send(JSON.stringify(userMessageData));

      this.selectedUserMessages.length = 0;
    },
    async gotoUserRoom(roomName, index) {
      this.selectedUserMessages.length = 0;
      const chatService = new ChatService();
      this.selectedUserIndex = index;
      this.connectToUserRoomWebSocket(roomName);
      const response = await chatService.getChatHistory(roomName);
      response.json.forEach(m => {
        this.selectedUserMessages.push(m);
      });
    },
    sendMessage() {
      if (!this.selectedUserRoomWebSocket) return;

      const userMessageData = {
        user: this.userUuid,
        title: 'Coordenador',
        timestamp: new Date().getTime(),
        sender: false,
        spinnerLoading: false,
        bot_should_respond: false,
        type: 'chat_user_admin_message',
        message: this.newMessage,
        data: {
          elements: null,
          quick_replies: null,
          buttons: null,
          attachment: null,
          image: null,
          custom: null
        }
      };

      this.selectedUserRoomWebSocket.send(JSON.stringify(userMessageData));
      this.newMessage = '';
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
  height: calc(100vh - 110px);
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

.usersList {
  height: calc(100vh - 65px);
}

.msg-body {
  height: calc(100vh - 100px);
}
</style>
