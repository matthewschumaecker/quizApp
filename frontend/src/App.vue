<template>
  <div id="app" class="container mt-5">
    <h1 class="text-center mb-2">Cardiology Question Generator</h1>
    <p class="development-notice text-center text-muted mb-4">
      (in development)
    </p>

    <div class="nav-buttons text-center mb-5">
      <button
        @click="currentView = 'quiz'"
        :class="['btn btn-lg mx-2 py-3 px-4 btn-secondary']"
      >
        Quiz Mode
      </button>
      <button
        @click="currentView = 'generation'"
        :class="['btn btn-lg mx-2 py-3 px-4 btn-secondary']"
      >
        Question Generation Mode
      </button>
    </div>

    <QuizApp v-if="currentView === 'quiz'" />
    <QuestionGeneration v-if="currentView === 'generation'" />
  </div>
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
