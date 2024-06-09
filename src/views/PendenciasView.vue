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
            <button class="btn btn-sm btn-success">Marcar como resolvido</button>
          </div>
        </div>
        <div class="card-body text-start">
          <h5 class="card-title">Descrição</h5>
          <p class="card-text">{{ pendencia.descricao }}</p>
        </div>
        <div class="card-footer text-body-secondary text-start">
          <div class="text-start">
            <span class="fw-bold me-2 fs-6">Em:</span>
            <span>{{ this.formatDate(pendencia.criado_em) }}</span>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li class="page-item"><a class="page-link" href="#">Anterior</a></li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link active" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item"><a class="page-link" href="#">Próximo</a></li>
      </ul>
    </nav>
  </div>
</template>

<script>
import router from '@/router';
import PendenciaService from '@/services/ivo/pendencias/PendenciaService';

export default {
  name: 'PendenciasView',
  data() {
    return {
      pendenciasCurrentPage: 1,
      pendenciasCount: null,
      pendenciasNext: null,
      pendenciasPrevious: null,
      pendenciasResults: [],
      pendenciasListShow: true,
      currentPendencia: null,
    };
  },
  created() {
    this.getPendencias();
  },
  methods: {
    async getPendencias() {
      const pendenciaService = new PendenciaService(),
        response = await pendenciaService.getAllPendencias(this.pendenciasCurrentPage);

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

          response.json.results.forEach(p => this.pendenciasResults.push(p));
          break;
        default:
          break;
      }
    },
    gotoPendencia(uuid) {
      console.log(uuid);
      if (this.pendenciasResults.length <= 0) return;

      this.currentPendencia = this.pendenciasResults.find(p => p.uuid == uuid);
      this.pendenciasListShow = !this.pendenciasListShow;
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
    }
  }
}
</script>

<style scoped>
#userPendencia {
  height: calc(100vh - 150px);
}

</style>
