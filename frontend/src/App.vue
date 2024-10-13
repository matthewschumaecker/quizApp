<!-- src/App.vue -->
<template>
  <div id="app">
    <h2>Cardiology Question Generator</h2>
    <h4>(in development)</h4>
    <br /><br />
    <QuizApp />
  </div>
</template>

<script>
import QuizApp from './components/QuizApp.vue';

export default {
  name: 'App',
  components: {
    QuizApp
  }
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  color: black;
  margin-top: 60px;
}
</style>
