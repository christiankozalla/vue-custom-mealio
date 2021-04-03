<template>
  <div id="main">
    <h1>Dein Gutschein Generator</h1>
    <input id="name-input" v-model="name" placeholder="Dein Name..." />
    <div v-if="nameMatches" id="gutschein-text">
      <p class="counter">
        Du hast <span id="number">{{ counter }}</span> Mal
        <em>bis in die Puppen <strong>ausschlafen</strong></em> frei!
      </p>
      <p v-if="counterToZero">
        Leider sind deine Gutscheine aufgebraucht... Ich hoffe, du hast gut
        geschlafen! :D
      </p>
      <button id="btn" @click.prevent="countDown">Gutschein einlösen</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      counter: null,
      name: "",
      counterToZero: false,
    };
  },
  created: function() {
    if (!localStorage.getItem("gutscheinCounter")) {
      localStorage.setItem("gutscheinCounter", 30);
    }
    this.counter = localStorage.getItem("gutscheinCounter");

    if (
      localStorage.getItem("name") &&
      (localStorage.getItem("name").toLowerCase() === "stephie" ||
        localStorage.getItem("name").toLowerCase() === "stephanie")
    ) {
      this.name = localStorage.getItem("name");
    }
  },
  computed: {
    nameMatches() {
      if (
        this.name.toLowerCase() === "stephie" ||
        this.name.toLowerCase() === "stephanie" ||
        localStorage.getItem("name") === "stephie" ||
        localStorage.getItem("name") === "stephanie"
      ) {
        localStorage.setItem("name", this.name);
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    countDown() {
      if (this.counter > 0) {
        this.counter--;
        localStorage.setItem("gutscheinCounter", this.counter);
      } else {
        this.counterToZero = true;
      }
    },
  },
};
</script>

<style scoped>
#main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

#name-input {
  width: 100%;
  max-width: 280px;
  padding: 15px 20px;
  outline: none;
  border: none;
  background-color: rgba(255, 255, 255, 0.3);
  font-size: 20px;
  border-radius: 16px 0px 16px 0px;
  margin: 1.4rem 0;
}

#btn {
  padding: 1rem 1.2rem;
  border: none;
  border-radius: 8px;
  background-color: #4a70ad;
  box-shadow: 2px 2px 7px rgba(0, 0, 0, 0.7);
  font-size: 1.2rem;
  margin-top: 2rem;
}

#btn:hover {
  transform: translateY(2px);
}

#gutschein-text {
  padding: 1rem;
  text-align: center;
  font-size: 2rem;
}

#number {
  padding: 0.5rem 0.7rem;
  border-radius: 5px;
  background-color: rgba(51, 170, 194, 0.6);
}
</style>
