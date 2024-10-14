<template>
  <div id="app">
    <h1>Cardiology Question Generator</h1>
    <p class="development-notice">(in development)</p>

    <div class="nav-buttons">
      <button @click="currentView = 'quiz'">Quiz Mode</button>
      <button @click="currentView = 'generation'">
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
  data() {
    return {
      currentView: 'quiz' // default view
    };
  }
};
import './assets/main.css';
</script>

<style></style>
