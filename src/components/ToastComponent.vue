<template>
  <div>
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        id="liveToast"
        class="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-header">
          <strong class="me-auto">{{ toastData.header }}</strong>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body">{{ toastData.body }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'bootstrap';

export default {
  name: "ToastComponent",
  data() {},
  props: {
    toastData: Object,
  },
  methods: {
    showToast() {
      const toastDom = document.querySelector('#liveToast');
      toastDom.classList.add(this.toastData.bg);
      Toast.getOrCreateInstance(toastDom).show();
    }
  }
};
</script>
