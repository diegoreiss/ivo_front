import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import VueChatScroll from 'vue3-chat-scroll';


createApp(App)
  .use(router)
  .use(VueChatScroll)
  .mount('#app');
