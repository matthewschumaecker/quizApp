<!-- src/App.vue -->
<template>
  <div id="app">
    <h2>Cardiology Question Generator</h2>
    <h4>(in development)</h4>
    <br /><br />
    <QuizApp :apiUrl="apiUrl" />
  </div>
</template>

<script>
import QuizApp from './components/QuizApp.vue';

export default {
  name: 'App',
  components: {
    QuizApp
  },
  data() {
    return {
      apiUrl: 'https://your-api-endpoint.com/quiz' // Replace with your actual API endpoint
    };
  }
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
