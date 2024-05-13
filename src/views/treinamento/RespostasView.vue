<template>
  <div class="pageBody m-3">
    <div id="responsesContainer" class="d-flex">
      <div id="responseCard" class="card me-2">
        <div class="card-header">Nome</div>
        <div class="card-body overflow-y-scroll">
          <div id="responsesList" class="list-group">
            <button
              v-for="(response, index) in responseData.responses"
              :key="index"
              type="button"
              class="list-group-item list-group-item-action"
              :class="{
                'bg-danger text-white': pagination.activeItem === index,
              }"
              @click="gotoResponse(index + 1)"
            >
              {{ response.responseName }}
            </button>
          </div>
        </div>
      </div>

      <div id="responseTextsCard" class="card">
        <div class="card-header">{{ responseData.currentResponse.responseName }}</div>
        <div class="card-body overflow-y-scroll">
          <div
            v-for="(text, index) in responseData.currentResponse.texts"
            :key="index"
            class="inputExample d-flex gap-2"
          >
            <div class="mb-3 w-100">
              <textarea
                class="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
                :value="text.text"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="responsesPagination" class="mt-3">
      <PaginationComponent
        :total-pages="responseData.totalPages"
        :current-page="pagination.currentPage"
        :item-per-page="3"
        @onPageChange="pageChange"
      />
    </div>
  </div>
</template>

<script>
import BotService from "@/services/ivo/bot/BotService";
import PaginationComponent from "@/components/PaginationComponent.vue";

export default {
  name: "RespostasView",
  components: {
    PaginationComponent,
  },
  data() {
    return {
      responseData: {
        totalPages: 0,
        responses: [],
        currentResponse: {},
      },
      pagination: {
        activeItem: 0,
        pages: 0,
        currentPage: 1,
      },
    };
  },
  created() {
    this.getAllResponses();
  },
  methods: {
    async getAllResponses() {
      const botService = new BotService(),
        response = await botService.getAllResponses(
          this.pagination.currentPage
        );

      this.responseData.totalPages = response.json.total_pages;

      const array = new Array();

      Object.entries(response.json.responses).forEach((value) => {
        array.push({
          responseName: value[0],
          texts: value[1],
        });
      });

      this.responseData.responses = array;
      this.responseData.currentResponse =
        this.responseData.responses[this.pagination.activeItem];
    },
    gotoResponse(number) {
      this.pagination.activeItem = number - 1;
      this.responseData.currentResponse =
        this.responseData.responses[number - 1];

      console.log(this.responseData.currentResponse);
    },
    pageChange(number) {
      this.pagination.currentPage = number;
      this.pagination.activeItem = 0;
      this.getAllResponses();
    }
  },
};
</script>

<style scoped>
#responseTextsCard {
  min-width: 50%;
}

#responseCard,
#responseTextsCard {
  height: calc(100vh - 145px);
}

#responseCard {
  min-width: 50%;
}
</style>
