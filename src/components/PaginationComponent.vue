<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button class="page-link" @click="previousPage">Anterior</button>
      </li>
      <li v-if="currentPage > 3" class="page-item disabled">
        <span class="page-link">...</span>
      </li>
      <li v-for="page in pagesToShow" :key="page" class="page-item">
        <button
          class="page-link"
          :class="{ 'bg-danger text-white': page === currentPage }"
          @click="gotoPage(page)"
          >{{ page }}</button
        >
      </li>
      <li v-if="currentPage < totalPages - 2" class="page-item disabled">
        <span class="page-link">...</span>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <button class="page-link" @click="nextPage">Próximo</button>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "PaginationComponent",
  props: {
    totalPages: Number,
    currentPage: Number,
    itemPerPage: Number,
  },
  data() {
    return {
    }
  },
  computed: {
    pagesToShow() {
      const currentPage = this.currentPage,
        totalPages = this.totalPages;
      
      if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      } else {
        let startPage = currentPage - 2,
          endPage = currentPage + 2;
        
        if (startPage <= 0) {
          startPage = 1;
          endPage = 5;
        } else if (endPage > totalPages) {
          startPage = totalPages - 4;
          endPage = totalPages;
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
      }
    },
  },
  methods: {
    previousPage() {
      this.$emit('onPageChange', this.currentPage - 1);
    },
    nextPage() {
      this.$emit('onPageChange', this.currentPage + 1);
    },
    gotoPage(number) {
      this.$emit('onPageChange', number)
    },
  }
};
</script>

<style scoped>
</style>
