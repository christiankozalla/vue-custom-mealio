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
          <button
            class="button is-small is-danger ml-1"
            @click="removeMeal(id)"
          >
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
      <div
        class="box my-2 p-2 has-background-success-light has-text-centered is-size-5 is-clickable"
        @click="isCookbookModalOpen = true"
      >
        <span class="icon mr-3"
          ><img
            src="@/assets/restaurant-outline.svg"
            alt="Restaurant Icon for Meal"
        /></span>
        <span class="meal-text-chosen">{{
          newMeal ? newMeal : "Hier Essen auswählen!"
        }}</span>
      </div>
      <div
        class="box my-2 p-2 has-background-success-light has-text-centered is-size-5"
      >
        <span class="icon mr-3"
          ><img
            src="@/assets/calendar-outline.svg"
            alt="Restaurant Icon for Meal"
        /></span>
        <span class="meal-text-chosen">{{
          newDate ? newDate : "Datum unten auswählen"
        }}</span>
      </div>
    </div>
    <div class="columns">
      <div class="column has-text-centered">
        <h3 class="subtitle mt-4">Wann?</h3>
        <div class="p-2">
          <transition-group name="fade">
            <div
              v-for="day in weekFromNow"
              :key="day"
              class="box is-clickable"
              :class="{
                'has-background-primary': newDate === day,
                'has-background-warning-light': newDate !== day,
              }"
              v-show="!meals.some((meal) => meal.date === day)"
              @click="newDate = day"
            >
              {{ day }}
            </div>
          </transition-group>
        </div>
      </div>

      <div class="modal" :class="{ 'is-active': isCookbookModalOpen }">
        <div
          class="modal-background"
          @click="isCookbookModalOpen = false"
        ></div>
        <div class="modal-content">
          <div class="box has-background-link-lignt">
            <div class="is-flex is-justify-content-space-between">
              <h3 class="subtitle  mt-4">Cookbook</h3>
              <button
                class="button is-danger"
                @click="isCookbookModalOpen = false"
              >
                &times;
              </button>
            </div>
            <div id="cookbook-col" class="p-2">
              <div
                v-for="{ name } in cookbook.dishes"
                :key="name"
                class="box is-clickable"
                :class="{
                  'has-background-primary': newMeal === name,
                  'has-background-link-light': newMeal !== name,
                }"
                @click="chooseMeal(name)"
              >
                {{ name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons is-centered">
      <button class="button is-primary is-large is-fullwidth" @click="addMeal">
        Meal hinzufügen!
      </button>
    </div>
    <hr />
    <div class="modal" :class="{ 'is-active': showQuestion }">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box has-background-danger-light">
          <div class="field has-text-centered is-size-5">
            Möchtest du <em>wirklich</em> den Speicher löschen?
          </div>

          <div class="is-flex is-justify-content-space-around">
            <button
              class="button is-danger is-medium mr-2"
              @click="clearStorage"
            >
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
      </div>
    </div>
    <button
      v-show="!showQuestion"
      class="button is-fullwidth is-danger my-6"
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
      cookbook: {},
      showQuestion: false,
      isCookbookModalOpen: false,
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
    weekFromNow() {
      let weekArray = [];
      for (let i = 0; i < 7; i++) {
        weekArray.push(this.getFormattedDate(i));
      }
      return weekArray;
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
          meal: this.newMeal,
          date: this.newDate,
        });
        localStorage.setItem("meals", JSON.stringify(this.meals));
        this.showWarning = false;
        this.resetMeal();
      } else {
        this.showWarning = true;
      }
    },
    chooseMeal(meal) {
      setTimeout(() => (this.isCookbookModalOpen = false), 900);
      let toggleBackground = setInterval(
        () => (this.newMeal = this.newMeal ? null : meal),
        170
      );
      setTimeout(() => clearInterval(toggleBackground), 700);
      this.newMeal = meal;
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
      this.showQuestion = false;
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

.meal-text-chosen {
  vertical-align: 4px;
}
</style>
