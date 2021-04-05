<template>
  <div class="container">
    <!--       <Main /> -->
    <Meals />
  </div>
</template>

<script>
import Main from "@/components/Main";
import Meals from "@/components/Meals";

export default {
  name: "App",
  components: {
    Main,
    Meals,
  },
};
</script>

<style>
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css";
</style>
