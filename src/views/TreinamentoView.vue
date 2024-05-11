<template>
  <div class="pageBody">
    <div class="navTreinamento">
      <nav class="navbar navbar-expand-lg bg-body-tertiary bg-dark" data-bs-theme="dark">
        <div class="container-fluid">
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse d-flex justify-content-between align-items-center" id="navbarNavTreinamento">
            <ul class="navbar-nav">
              <li class="nav-item">
                <NavbarNavLinkComponent :to="'/home/treinamento/intencoes'" :name="'Intenções'" />
              </li>
              <li class="nav-item">
                <NavbarNavLinkComponent :to="'/home/treinamento/respostas'" :name="'Respostas'" />
              </li>
              <li class="nav-item">
                <NavbarNavLinkComponent :to="'/home/treinamento/dialogos'" :name="'Diálogos'" />
              </li>
            </ul>
            <button class="btn btn-danger">Treinar Modelo</button>
          </div>
        </div>
      </nav>
    </div>
  </div>
  <router-view />
</template>

<script>
import NavbarNavLinkComponent from '@/components/NavbarNavLinkComponent.vue';
import router from '@/router';
export default {
  name: "TreinamentoView",
  components: {
    NavbarNavLinkComponent
  },
  data() {
    return {};
  },
  mounted() {
    router.push({ name: 'treinamento.intencoes' });
  },
  methods: {
  }
};
</script>

<style scoped>
#navbarNavTreinamento li a {
  text-decoration: none;
}
</style>
