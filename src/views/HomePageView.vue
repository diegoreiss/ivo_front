<template>
  <div id="pageBody" class="d-flex flex-nowrap">
    <SidebarComponent />
    <div id="sectionBody" class="w-100" style="background-color: #faf1e4;">
      <router-view />
    </div>
  </div>
</template>

<script>
import SidebarComponent from '../components/SidebarComponent.vue'

export default {
  name: 'HomePageView',
  components: {
    SidebarComponent,
  },
}
</script>

<style scoped>
#pageBody {
  height: 100vh;
}
</style>
