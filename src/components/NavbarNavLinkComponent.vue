<template>
  <router-link :to="to">
    <span class="nav-link" :class="{ 'bg-danger text-white rounded': isActive }">{{ name }}</span>
  </router-link>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "NavbarNavLinkComponent",
  props: {
    to: String,
    name: String,
  },
  setup(props) {
    const route = useRoute();
    const isActive = computed(() => route.path === props.to);

    return { isActive };
  },
};
</script>

