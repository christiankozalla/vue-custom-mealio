<template>
  <div id="app">
    <div id="container">
      <Main />
      <Meals />
    </div>
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
*,
html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: linear-gradient(rgba(255, 255, 255, 0.5), rgba(0, 0, 0, 0.9)),
    url("./assets/background.png");
  background-repeat: no-repeat;
  background-size: cover;
  width: 100vw;
  height: 100vh;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#container {
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  width: 800px;
  text-shadow: 2px 2px 1px rgba(255, 255, 255, 0.3);
  margin: 0 auto;
}
</style>
