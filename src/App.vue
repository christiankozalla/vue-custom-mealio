<template>
  <div id="app">
    <Main />
  </div>
</template>

<script>
import Main from "./components/Main";

export default {
  name: "App",
  components: {
    Main,
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
</style>
