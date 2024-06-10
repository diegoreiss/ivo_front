<template>
  <div class="pageBody">
    <nav class="navbar bg-body-tertiary" data-bs-theme="dark">
      <div class="container-fluid">
        <a class="navbar-brand"></a>
        <form class="d-flex" role="search">
          <input class="form-control me-2" type="search" placeholder="Aluno ou Descrição" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Procurar</button>
        </form>
      </div>
    </nav>
    <div id="userPendencia" class="px-3 pt-3 overflow-y-scroll">
      <div class="card text-center mb-3" v-for="(pendencia, index) in pendenciasResults" :key="index">
        <div class="card-header d-flex align-items-center justify-content-between">
          <div class="text-start">
            <span class="fw-bold me-2 fs-6">Aluno:</span>
            <span>{{ pendencia.custom_user_first_name }} {{ pendencia.custom_user_last_name }}</span>
          </div>
          <div class="text-end">
            <button v-if="$props.user.role === 1" class="btn btn-sm btn-success">Marcar como resolvido</button>
          </div>
        </div>
        <div class="card-body text-start">
          <h5 class="card-title">Descrição</h5>
          <p class="card-text">{{ pendencia.descricao }}</p>
        </div>
        <div class="card-footer text-body-secondary d-flex align-items-center justify-content-between">
          <div class="text-start">
            <span class="fw-bold me-2 fs-6">Em:</span>
            <span>{{ this.formatDate(pendencia.criado_em) }}</span>
          </div>
          <div class="text-end">
            <span class="fw-bold me-2 fs-6">Status:</span>
            <span class="badge rounded-pill"
              :class="{ 'text-bg-warning': pendencia.status === 1, 'text-bg-success': pendencia.status === 2 }">{{
              pendenciaStatus[pendencia.status] }}</span>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <PaginationComponent :total-pages="this.pendenciasTotalPages" :current-page="this.pendenciasCurrentPage"
      :item-per-page="10" @onPageChange="changePage" />
  </div>
</template>

<script>
import PaginationComponent from '@/components/PaginationComponent.vue';
import router from '@/router';
import PendenciaService from '@/services/ivo/pendencias/PendenciaService';

export default {
  name: 'PendenciasView',
  components: {
    PaginationComponent
  },
  data() {
    return {
      pendenciasCurrentPage: 1,
      pendenciasCount: null,
      pendenciasNext: null,
      pendenciasPrevious: null,
      pendenciasTotalPages: 0,
      pendenciasResults: [],
      pendenciasListShow: true,
      currentPendencia: null,
      pendenciaStatus: {
        1: 'Aguardando Resposta',
        2: 'Resolvido'
      }
    };
  },
  props: {
    user: Object
  },
  created() {
    if (this.$props.user.role === 1) {
      this.getPendencias();

      return;
    }

    this.getPendenciasByUser();
  },
  methods: {
    async getPendenciasByUser() {
      this.pendenciasResults.length = 0;
      const pendenciaService = new PendenciaService(),
        response = await pendenciaService.getPendenciasByUser(this.pendenciasCurrentPage, this.$props.user.uuid);

      switch (response.status_code) {
        case 400:
        case 401:
        case 403:
          router.push({ name: 'auth.login' });
          break;
        case 200:
          console.log(response.json);
          this.pendenciasCount = response.json.count;
          this.pendenciasNext = response.json.next;
          this.pendenciasPrevious = response.json.previous;
          this.pendenciasTotalPages = response.json.total_pages;
          response.json.results.forEach(p => this.pendenciasResults.push(p));
          break;
        default:
          break;
      }
    },
    async getPendencias() {
      this.pendenciasResults.length = 0;
      const pendenciaService = new PendenciaService(),
        response = await pendenciaService.getAllPendencias(this.pendenciasCurrentPage);

      switch (response.status_code) {
        case 400:
        case 401:
        case 403:
          router.push({ name: 'auth.login' });
          break;
        case 200:
          this.pendenciasCount = response.json.count;
          this.pendenciasNext = response.json.next;
          this.pendenciasPrevious = response.json.previous;
          this.pendenciasTotalPages = response.json.total_pages;

          response.json.results.forEach(p => this.pendenciasResults.push(p));
          break;
        default:
          break;
      }
    },
    formatDate(date) {
      const myDate = new Date(date);
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
      };

      return myDate.toLocaleDateString('pt-BR', options);
    },
    changePage(number) {
      console.log(number);
      this.pendenciasCurrentPage = number;

      if (this.$props.user.role === 1) {
        this.getPendencias();

        return;
      }

      this.getPendenciasByUser();
    }
  },
}
</script>

<style scoped>
#userPendencia {
  height: calc(100vh - 150px);
}
</style>
