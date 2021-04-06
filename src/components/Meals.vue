<template>
  <div class="container is-max-desktop mt-2 px-2">
    <h2 class="title has-text-centered">Unsere Mittagessen</h2>
    <ul v-if="sortedMeals.length > 0">
      <transition-group name="fade">
        <li
          v-for="{ meal, date, id } in sortedMeals"
          :key="id"
          class="box my-2 p-2 has-text-white has-background-info-dark is-flex is-justify-content-space-between is-align-items-center"
        >
          {{ date }} - {{ meal }}
          <button class="button is-small is-danger" @click="removeMeal(id)">
            &times;
          </button>
        </li>
      </transition-group>
    </ul>
    <ul v-else>
      <li
        class="box my-2 p-2 has-text-white has-background-danger-dark has-text-centered"
      >
        Keine Essen
      </li>
    </ul>
    <div>
      <h2 class="subtitle has-text-centered mt-4">Mittagessen wählen</h2>
      <div class="box my-2 p-2 has-background-grey-lighter has-text-centered">
        {{ newMeal ? newMeal : "Kein Essen ausgewählt" }}
      </div>
      <div class="box my-2 p-2 has-background-grey-lighter has-text-centered">
        {{ newDate ? newDate : "Kein Datum ausgewählt" }}
      </div>
      <div class="buttons is-centered">
        <button
          class="button is-primary is-large is-fullwidth"
          @click="addMeal"
        >
          Meal hinzufügen!
        </button>
      </div>
    </div>
    <div class="columns">
      <div class="column has-text-centered">
        <h3 class="subtitle mt-4">Wann?</h3>
        <div class="p-2">
          <transition-group name="fade">
            <div
              v-for="dayOffset in 7"
              :key="dayOffset"
              class="box is-clickable has-background-warning-light"
              v-show="!meals.some((meal) => meal.date === checkDate(dayOffset))"
              @click="chooseDate(dayOffset - 1)"
            >
              {{ getFormattedDate(dayOffset - 1) }}
            </div>
          </transition-group>
        </div>
      </div>
      <div class="column has-text-centered">
        <h3 class="subtitle  mt-4">Cookbook</h3>
        <div id="cookbook-col" class="p-2">
          <div
            v-for="{ name } in cookbook.dishes"
            :key="name"
            class="box is-clickable has-background-info-light"
            @click="chooseMeal(name)"
          >
            {{ name }}
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div v-show="showQuestion" class="box has-background-danger-light">
        <div class="field has-text-centered is-size-5">
          Möchtest du <em>wirklich</em> den Speicher löschen?
        </div>

        <div class="is-flex is-justify-content-space-around">
          <button class="button is-danger is-medium mr-2" @click="clearStorage">
            Ja, wirklich!
          </button>
          <button
            class="button is-info is-medium ml-2"
            @click="showQuestion = false"
          >
            Nein, doch nicht.
          </button>
        </div>
      </div>
    </transition>
    <button
      v-show="!showQuestion"
      class="button is-fullwidth is-danger mt-6"
      @click="showQuestion = true"
    >
      Lösche Speicher
    </button>
  </div>
</template>

<script>
import cookbook from "@/assets/cookbook.json";
export default {
  name: "Meals",
  data() {
    return {
      meals: [],
      newMeal: "",
      newDate: "",
      newDateEncoded: null,
      cookbook: {},
      showQuestion: false,
      weekDayMap: [
        "Sonntag",
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag",
      ],
    };
  },
  computed: {
    sortedMeals() {
      return this.meals.sort((a, b) => (a.milliDate > b.milliDate ? 1 : -1));
    },
  },
  methods: {
    generateUniqueId() {
      return (
        "_" +
        Math.random()
          .toString(36)
          .substring(2, 9)
      );
    },
    addMeal() {
      if (this.newMeal && this.newDate) {
        this.meals.push({
          id: this.generateUniqueId(),
          key: `${this.newDate}-${this.newMeal}`,
          meal: this.newMeal,
          date: this.newDate,
          milliDate: this.newDateEncoded,
        });
        localStorage.setItem("meals", JSON.stringify(this.meals));
        this.showWarning = false;
        this.resetMeal();
      } else {
        this.showWarning = true;
      }
    },
    chooseMeal(meal) {
      this.newMeal = meal;
    },
    chooseDate(dayOffset) {
      let chosenDate = this.getFormattedDate(dayOffset);
      this.newDateEncoded = new Date()
        .setDate(new Date().getDate() + dayOffset - 1)
        .valueOf();
      this.newDate = chosenDate;
    },
    checkDate(dayOffset) {
      return new Date(
        new Date().setDate(new Date().getDate() + dayOffset - 1)
      ).toDateString();
    },
    getDayString(dayOffset) {
      return this.weekDayMap[
        new Date(new Date().setDate(new Date().getDate() + dayOffset)).getDay()
      ];
    },
    getFormattedDate(dayOffset) {
      let dayNameString = this.getDayString(dayOffset);
      let dayString = new Date(
        new Date().setDate(new Date().getDate() + dayOffset)
      )
        .getDate()
        .toString()
        .padStart(2, "0");
      let monthString = (
        new Date(
          new Date().setDate(new Date().getDate() + dayOffset)
        ).getMonth() + 1
      )
        .toString()
        .padStart(2, "0");

      return dayNameString + " - " + dayString + "." + monthString;
    },
    resetMeal() {
      this.newMeal = "";
      this.newDate = "";
    },
    removeMeal(mealId) {
      let mealIndex = this.meals.findIndex((meal) => meal.id === mealId);

      if (mealIndex !== -1) {
        this.meals.splice(mealIndex, 1);
      }
    },
    clearStorage() {
      this.meals = [];
      localStorage.clear();
    },
  },
  beforeMount() {
    this.cookbook = cookbook;
    let storedMeals = localStorage.getItem("meals");
    if (storedMeals) {
      let storedMealsArray = JSON.parse(storedMeals);
      this.meals = storedMealsArray;
    }
  },
  beforeUpdate() {
    let stringifiedMeals = JSON.stringify(this.meals);
    localStorage.setItem("meals", stringifiedMeals);
  },
};
</script>

<style scoped>
#cookbook-col {
  max-height: 600px;
  overflow-y: scroll;
}

#cookbook-col::-webkit-scrollbar {
  width: 10px;
}

#cookbook-col::-webkit-scrollbar-track {
  background: white;
}

#cookbook-col::-webkit-scrollbar-thumb {
  background-color: slateblue;
  border-radius: 5px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
