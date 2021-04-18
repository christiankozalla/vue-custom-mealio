<template>
  <div class="container is-max-desktop mt-2 px-2">
    <h1 class="title is-size-2 pt-6 has-text-centered">
      Meal<span id="svg-torque">io</span>
    </h1>
    <h2 class="is-size-3 has-text-centered my-4">
      Create your weekly meal plan
    </h2>
    <h2 class="is-size-3 has-text-centered mb-4">
      like <span class="has-text-primary is-italic">one, </span>
      <span class="has-text-info is-italic">two, </span>
      <span class="has-text-danger is-italic">three</span>
    </h2>
    <div class="mx-6">
      <div
        class="box my-2 p-2 has-background-primary has-text-black has-text-centered is-size-5 is-clickable"
        role="button"
        @click="openCookbookModal"
      >
        <span class="icon mr-3"
          ><img
            src="@/assets/restaurant-outline.svg"
            alt="Restaurant Icon for Meal"
        /></span>
        <span class="meal-text-chosen">{{
          newMeal ? newMeal : "Choose your meal!"
        }}</span>
      </div>

      <div
        class="box my-2 p-2 has-background-info has-text-black has-text-centered is-size-5 is-clickable"
        role="button"
        @click="openDatePickerModal"
      >
        <span class="icon mr-3"
          ><img
            src="@/assets/calendar-outline.svg"
            alt="Restaurant Icon for Meal"
        /></span>
        <span class="meal-text-chosen">{{
          newDate ? newDate : "Choose the date!"
        }}</span>
      </div>
      <button
        class="button is-danger has-text-black is-size-5 is-fullwidth px-6"
        role="button"
        @click="addMeal"
      >
        <span class="icon mr-3"
          ><img src="@/assets/add-circle-outline.svg" alt="Add Circle Icon"
        /></span>
        Add meal!
      </button>
    </div>

    <div class="modal" :class="{ 'is-active': isDatePickerModalOpen }">
      <div
        class="modal-background"
        @click="isDatePickerModalOpen = false"
      ></div>
      <div class="modal-content">
        <div class="box">
          <div class="is-flex is-justify-content-space-between">
            <h2 class="subtitle mt-4">When?</h2>
            <button
              class="button is-danger"
              @click="isDatePickerModalOpen = false"
            >
              &times;
            </button>
          </div>
          <div
            v-for="{ day, milliDate } in weekFromNow"
            :key="day"
            class="box is-clickable"
            :class="{
              'has-background-primary': newDate === day,
              'has-background-warning-light': newDate !== day,
            }"
            v-show="!meals.some((meal) => meal.date === day)"
            @click="chooseDate(day, milliDate)"
          >
            {{ day }}
          </div>
        </div>
      </div>
    </div>

    <div class="modal" :class="{ 'is-active': isCookbookModalOpen }">
      <div class="modal-background" @click="isCookbookModalOpen = false"></div>
      <div class="modal-content">
        <div class="box">
          <div
            class="is-flex is-justify-content-space-between is-align-items-center"
          >
            <h3 class="subtitle mt-4">Cookbook</h3>
            <span>
              <button
                class="button is-primary mr-3"
                @click="showMealDialogAndFocusInput"
              >
                {{ showCreateNewMealInput ? "Close" : "Create new meal!" }}
              </button>
              <button
                class="button is-danger"
                @click="
                  (isCookbookModalOpen = false),
                    (showCreateNewMealInput = false)
                "
              >
                &times;
              </button>
            </span>
          </div>
          <transition name="fade">
            <div
              v-show="showCreateNewMealInput"
              class="box has-background-primary"
            >
              <p class="is-size-6 mb-3">
                <span class="icon mr-1"
                  ><img
                    src="../assets/koala-menu-logo-60.png"
                    alt="Koala Menu Logo"
                /></span>
                Add any meal to your personal cookbook
              </p>

              <div
                class="is-flex is-justify-content-space-between is-align-items-center mb-2"
              >
                <input
                  class="input is-primary is-rounded mr-2"
                  type="text"
                  placeholder="Type the name of your new meal"
                  ref="createNewMealInput"
                  v-model="newMealToCreate"
                  @keydown.enter="createNewMeal"
                />
                <button
                  class="button is-primary is-light"
                  @click="createNewMeal"
                >
                  Create!
                </button>
              </div>
            </div>
          </transition>
          <div v-if="cookbook.length === 0" class="content px-4 mt-2">
            <hr />
            <p class="subtitle">Oh, you must be new here!</p>
            <p>
              You can create your own meals and add them to your personal
              cookbook.
            </p>
            <div class="columns">
              <p class="column is-four-fifths">
                It's going to be stored safely in your browser just for you!
              </p>
              <div class="column">
                <img
                  src="../assets/koala-menu-logo-60.png"
                  alt="Koala Menu Logo"
                  style="display: block; margin-left: auto;"
                />
              </div>
            </div>
          </div>
          <div
            v-for="{ name } in cookbook"
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

    <h3 class="subtitle is-size-3 mt-5 has-text-centered">Your Menu</h3>
    <ul v-if="sortedMeals.length > 0">
      <transition-group name="fade">
        <li
          v-for="{ meal, date, id } in sortedMeals"
          :key="id"
          class="box my-2 p-3 has-text-black is-size-5 has-background-info is-flex is-justify-content-space-between is-align-items-center"
        >
          {{ date }} - {{ meal }}
          <button class="delete ml-1" @click="removeMeal(id)">
            &times;
          </button>
        </li>
      </transition-group>
    </ul>
    <ul v-else>
      <li class="box my-2 p-2 has-background-warning-light has-text-centered">
        No meals yet
      </li>
    </ul>
    <hr />
    <div class="modal" :class="{ 'is-active': showQuestion }">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box has-background-danger-light">
          <div class="field has-text-centered is-size-5">
            Do you <em>really</em> want to clear your meal plan?
          </div>

          <div class="is-flex is-justify-content-space-around">
            <button
              class="button is-danger is-medium mr-2"
              @click="clearStorage"
            >
              Yes, for sure!
            </button>
            <button
              class="button is-info is-medium ml-2"
              @click="showQuestion = false"
            >
              Nay, cancel.
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="is-flex is-justify-content-space-between mb-2">
      <a
        class="button is-info"
        href="https://twitter.com/intent/tweet?text=Hey%20I%20am%20using%20Mealio%20as%20my%20weekly%20meal%20planner%0A%0A&amp;url=https%3A%2F%2Fmealio.surge.sh%0A&amp;hashtags=mealio&amp;via=CKozalla"
        target="_blank"
        rel="nofollow noopener noreferrer"
        aria-label="Share this with Twitter. (opens in new window)"
      >
        <span class="icon mr-2"
          ><img src="@/assets/logo-twitter.svg" alt="Twitter Logo Icon"/></span
        >Tell your friends!
      </a>
      <button
        v-show="!showQuestion"
        class="button is-danger"
        @click="showQuestion = true"
      >
        Clear plan
      </button>
    </div>
    <a
      class="button is-fullwidth has-background-primary is-size-5 mb-3"
      rel="nofollow noopener noreferrer"
      target="_blank"
      href="https://github.com/christiankozalla/vue-family-meal"
    >
      View Source Code on GitHub
      <span class="icon ml-2">
        <img src="@/assets/logo-github.svg" alt="GitHub logo"
      /></span>
    </a>
  </div>
</template>

<script>
export default {
  name: "Meals",
  data() {
    return {
      meals: [],
      newMeal: "",
      newDate: "",
      newMilliDate: null,
      cookbook: [],
      newMealToCreate: "",
      showQuestion: false,
      isCookbookModalOpen: false,
      isDatePickerModalOpen: false,
      showCreateNewMealInput: false,
      weekDayMap: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
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
          milliDate: this.newMilliDate,
        });
        localStorage.setItem("meals", JSON.stringify(this.meals));
        this.resetMeal();
      }
    },
    openCookbookModal() {
      setTimeout(() => (this.isCookbookModalOpen = true), 100);
    },
    openDatePickerModal() {
      setTimeout(() => (this.isDatePickerModalOpen = true), 100);
    },
    chooseMeal(meal) {
      this.newMeal = meal;
      setTimeout(() => (this.isCookbookModalOpen = false), 500);
    },
    chooseDate(day, milliDate) {
      this.newDate = day;
      this.newMilliDate = milliDate;
      setTimeout(() => (this.isDatePickerModalOpen = false), 500);
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

      let formattedDate = dayNameString + " - " + dayString + "." + monthString;
      let milliDate = new Date(
        new Date().setDate(new Date().getDate() + dayOffset)
      ).valueOf();

      return { day: formattedDate, milliDate: milliDate };
    },
    showMealDialogAndFocusInput() {
      this.showCreateNewMealInput = !this.showCreateNewMealInput;
      this.$nextTick(function() {
        this.$refs.createNewMealInput.focus();
      });
    },
    createNewMeal() {
      // Sanitize input from user with regex
      if (this.newMealToCreate) {
        this.cookbook.push({ name: this.newMealToCreate });
        this.newMealToCreate = "";
        this.showCreateNewMealInput = false;
      } else {
        this.$refs.createNewMealInput.focus();
      }
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
    if (localStorage.getItem("cookbook")) {
      let personalCookbook = JSON.parse(localStorage.getItem("cookbook"));
      this.cookbook = personalCookbook;
    } else {
      localStorage.setItem("cookbook", this.cookbook);
    }

    let storedMeals = localStorage.getItem("meals");
    if (storedMeals) {
      let storedMealsArray = JSON.parse(storedMeals);
      this.meals = storedMealsArray;
    }
  },
  beforeUpdate() {
    localStorage.setItem("meals", JSON.stringify(this.meals));
    localStorage.setItem("cookbook", JSON.stringify(this.cookbook));
  },
};
</script>

<style scoped>
.meal-text-chosen {
  vertical-align: 4px;
}

@media (min-width: 500px) {
  .modal-content::-webkit-scrollbar {
    width: 4px;
    background-color: lightgray;
  }

  .modal-content::-webkit-scrollbar-thumb {
    background-color: #555;
    border-radius: 2px;
  }
}

#svg-torque {
  position: relative;
}

#svg-torque::before {
  content: " ";
  position: absolute;
  top: -2.2rem;
  right: -1.1rem;
  z-index: 2;
  width: 50px;
  height: 50px;
  background-size: cover;
  background-image: url("../assets/koala-menu-logo-60.png");
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
