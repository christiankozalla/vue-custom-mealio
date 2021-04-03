<template>
  <div id="meals">
    <h2>Unsere Mittagessen</h2>
    <ul v-if="meals.length > 0">
      <li v-for="{ meal, date } in meals" :key="meal.id">
        {{ meal }} {{ date }}
      </li>
    </ul>
    <ul v-else>
      <li>Keine Essen</li>
    </ul>
    <div id="meals__choose" class="radius">
      <h2>Mittagessen wählen</h2>
      <div id="meals__choose-date" class="radius">
        {{ newDate ? newDate : "Kein Datum ausgewählt" }}
      </div>
      <div id="meals__choose-meal" class="radius">
        {{ newMeal ? newMeal : "Kein Essen ausgewählt" }}
      </div>
    </div>
    <div class="grid">
      <button id="addMeal" @click="addMeal" class="radius">
        Meal hinzufügen!
      </button>
      <div id="meals__dishes">
        <h3 class="meals-headline">Cookbook</h3>
        <ul class="list-style-none">
          <li
            v-for="dish in cookbook.dishes"
            :key="dish.name"
            class="cookbook__li radius"
            @click="chooseMeal(dish.name)"
          >
            {{ dish.name }}
          </li>
        </ul>
      </div>
      <div id="meals__dates">
        <h3 class="meals-headline">Wann?</h3>
        <ul class="list-style-none">
          <li
            v-for="dayOffset in 7"
            :key="dayOffset"
            class="cookbook__li radius"
            @click="chooseDate(dayOffset)"
          >
            {{ getDayString(dayOffset) }}
            {{
              new Date(new Date().setDate(new Date().getDate() + dayOffset - 1))
                .getDate()
                .toString()
                .padStart(2, "0")
            }}.{{
              (
                new Date(
                  new Date().setDate(new Date().getDate() + dayOffset - 1)
                ).getMonth() + 1
              )
                .toString()
                .padStart(2, "0")
            }}
          </li>
        </ul>
      </div>
    </div>
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
      weekDayMap: [
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag",
        "Sonntag",
      ],
    };
  },
  methods: {
    addMeal() {
      if (this.newMeal && this.newDate) {
        this.meals.push({
          key: `${this.newDate}-${this.newMeal}`,
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
      // Mach ein richtiges speicherbares Object daraus
      this.newMeal = meal;
    },
    chooseDate(dayOffset) {
      let chosenDate = new Date(
        new Date().setDate(new Date().getDate() + dayOffset - 1)
      ).toDateString();
      this.newDate = chosenDate;
    },
    getDayString(dayOffset) {
      return this.weekDayMap[
        new Date(
          new Date().setDate(new Date().getDate() + dayOffset - 1)
        ).getDay()
      ];
    },
    resetMeal() {
      this.newMeal = "";
      this.newDate = "";
    },
  },
  // JSON.parse // JSON.stringify
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
#meals {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

#meals__choose {
  text-align: center;
  margin: 0 auto;
  width: 500px;
}

#meals__choose-date,
#meals__choose-meal {
  padding: 0.7rem 1.4rem 0.7rem 0.4rem;
  margin: 0.5rem 0;
  width: 100%;
}

#meals__choose-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: tomato;
}

#meals__choose-meal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: turquoise;
}

#meals__choose-date::before {
  content: "Tag:";
  background-color: lightpink;
  padding: 0.4rem 0.6rem;
  border-radius: 5px;
}

#meals__choose-meal::before {
  content: "Essen:";
  background-color: lightblue;
  padding: 0.4rem 0.6rem;
  border-radius: 5px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
}

#addMeal {
  grid-column-start: 1;
  grid-column-end: 3;

  padding: 1rem 2rem;
  background-color: lightsteelblue;
  border: 2px solid #fff;
  text-decoration: none;
  text-align: center;
  font-family: inherit;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

#addMeal:hover {
  background-color: lightslategray;
}

#addMeal:active {
  transform: translateY(4px);
}

.cookbook__li {
  padding: 0.5rem 0.7rem;
  margin-bottom: 0.4rem;
  background-color: lightgrey;
  cursor: pointer;
}

.cookbook__li:hover {
  background-color: darkgrey;
}

.meals-headline {
  margin-bottom: 5px;
  text-align: center;
}

.radius {
  border-radius: 5px;
}

.list-style-none {
  list-style: none;
}
</style>
