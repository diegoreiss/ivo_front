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
                  <li class="sender d-block w-100 position-relative my-3">
                    <p
                      class="text-dark fs-6 p-3 lh-base fw-normal d-inline-block bg-secondary bg-opacity-10 rounded"
                    >
                      Olá eu sou o ivo
                    </p>
                  </li>
                  <li
                    class="repaly d-block w-100 text-end position-relative my-3"
                  >
                    <p
                      class="text-light fs-6 p-3 lh-base fw-normal d-inline-block mybg-red bg-opacity-75 rounded"
                    >
                      Bom dia!
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div class="send-box p-3 border-top">
              <form action="" class="d-flex gap-3 w-100 align-items-center justify-content-between">
                <input class="form-control" type="text" name="" id="" aria-label="mensagem..." placeholder="Escreva uma mensagem..." >
                <button class="btn text-white fs-6 w-25 mybg-red" type="button">
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
export default {
  name: "ChatView",
};
</script>

<style scoped>
.msg-body {
  height: calc(100vh - 200px);
}

.msg-body ul li.sender::before {
  display: block;
  clear: both;
  content: "";
  position: absolute;
  top: -6px;
  left: -7px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 12px 15px 12px;
  border-color: transparent transparent #ece4da transparent;
  -webkit-transform: rotate(-37deg);
  -ms-transform: rotate(-37deg);
  transform: rotate(-37deg);
}

.msg-body ul li.repaly::before {
  display: block;
  clear: both;
  content: "";
  position: absolute;
  bottom: 15px;
  right: -7px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 12px 15px 12px;
  border-color: transparent transparent #da494e transparent;
  -webkit-transform: rotate(37deg);
  -ms-transform: rotate(37deg);
  transform: rotate(37deg);
}

.mybg-red {
  background-color: #da494e !important;
}
</style>
