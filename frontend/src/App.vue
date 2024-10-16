<template>
  <nav
    class="navbar navbar-expand-sm navbar-dark bg-dark"
    style="height: 100px"
  >
    <a class="navbar-brand fs-2 p-3" href="#">Cardiology Question Generator</a>

    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item" @click="currentView = 'quiz'">
          <a class="nav-link" href="#">Quiz Mode</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click="currentView = 'generation'" href="#"
            >Question Generation Mode</a
          >
        </li>
      </ul>
    </div>
  </nav>

  <QuizApp v-if="currentView === 'quiz'" />
  <QuestionGeneration v-if="currentView === 'generation'" />
</template>

<script>
import { ref } from 'vue';
import QuizApp from './components/QuizApp.vue';
import QuestionGeneration from './components/QuestionGenerator.vue';

export default {
  name: 'App',
  components: {
    QuizApp,
    QuestionGeneration
  },
  setup() {
    const currentView = ref('quiz'); // default view
    return { currentView };
  }
};
</script>
