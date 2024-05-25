<template>
  <router-link :to="to">
    <span
      class="nav-link text-white d-flex justify-content-start align-items-center gap-3"
      :class="{ 'bg-danger rounded': isActive }"
    >
      <i :class="icon"></i>
      {{ name }}
    </span>
  </router-link>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "SidebarLinkComponent",
  props: {
    to: String,
    name: String,
    icon: String,
  },
  setup(props) {
    const route = useRoute();
    const regex = new RegExp('^' + props.to + '(/|$)');
    const isActive = computed(() => regex.test(route.path));

    return { isActive };
  },
};
</script>
