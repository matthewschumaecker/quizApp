<template>
  <div class="quiz-app container">
    <br />
    <h2 class="text-center">Quiz Mode</h2>
    <br />

    <div class="container">
      <div class="d-flex justify-content-center">
        <div class="form-group me-5">
          <label for="topic" class="form-label">Topic:</label>
          <input
            id="topic"
            v-model="topic"
            class="form-control"
            style="width: 200px"
            placeholder="Enter quiz topic"
            @keyup.enter="startQuiz"
          />
        </div>

        <div class="form-group">
          <label for="numQuestions" class="form-label"
            >Number of Questions:</label
          >
          <input
            id="numQuestions"
            v-model.number="numQuestions"
            type="number"
            min="1"
            value="1"
            class="form-control"
            style="width: 100px"
            @keyup-enter="startQuiz"
          />
        </div>
      </div>
    </div>

    <div class="row justify-content-center">
      <button
        @click="startQuiz"
        :disabled="!topic || numQuestions < 1"
        class="btn btn-primary"
        style="width: 150px; margin: 20px"
      >
        Start Quiz
      </button>
    </div>

    <br /><br /><br />
    <div v-if="currentQuestion" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">{{ currentQuestion.text }}</h5>
        <ul class="list-group mb-3">
          <li
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="list-group-item list-group-item-action"
            :class="{ active: selectedOption === index }"
            @click="selectOption(index)"
          >
            {{ option }}
          </li>
        </ul>
        <button
          @click="submitAnswer"
          :disabled="selectedOption === null"
          class="btn btn-dark"
        >
          Submit Answer
        </button>
      </div>
    </div>

    <div v-if="showResult" class="alert" :class="resultClass" role="alert">
      <strong>{{ resultMessage }}</strong>
      <p class="mb-0">{{ currentQuestion.explanation }}</p>
    </div>

    <button
      v-if="showResult && !isLastQuestion"
      @click="nextQuestion"
      class="btn btn-primary mb-3"
    >
      Next Question
    </button>

    <p v-if="isLastQuestion && showResult" class="alert alert-secondary">
      Your final score is: {{ score }}/{{ questions.length }}
    </p>

    <div v-if="loading" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p v-if="error" class="alert alert-danger">{{ error }}</p>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import axios from 'axios';

export default {
  name: 'QuizApp',
  setup() {
    const topic = ref('');
    const numQuestions = ref(1);
    const questions = ref([]);
    const currentQuestionIndex = ref(0);
    const selectedOption = ref(null);
    const showResult = ref(false);
    const score = ref(0);
    const loading = ref(false);
    const error = ref(null);

    const currentQuestion = computed(
      () => questions.value[currentQuestionIndex.value]
    );
    const isLastQuestion = computed(
      () => currentQuestionIndex.value === questions.value.length - 1
    );
    const resultMessage = computed(() =>
      selectedOption.value === currentQuestion.value.correctAnswer
        ? 'Correct!'
        : 'Incorrect'
    );
    const resultClass = computed(() =>
      selectedOption.value === currentQuestion.value.correctAnswer
        ? 'alert-success'
        : 'alert-danger'
    );

    const startQuiz = async () => {
      if (!topic.value || numQuestions.value < 1) return;

      try {
        loading.value = true;
        error.value = null;
        const response = await axios.get(
          '/api/generateQuestion',
          {
            params: { topic: topic.value, numQuestions: numQuestions.value }
          }
        );
        questions.value = response.data;
        currentQuestionIndex.value = 0;
        selectedOption.value = null;
        showResult.value = false;
        score.value = 0;
      } catch (err) {
        error.value = 'Failed to load questions';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const selectOption = (index) => {
      selectedOption.value = index;
    };

    const submitAnswer = () => {
      if (selectedOption.value === currentQuestion.value.correctAnswer) {
        score.value++;
      }
      showResult.value = true;
    };

    const nextQuestion = () => {
      currentQuestionIndex.value++;
      selectedOption.value = null;
      showResult.value = false;
    };

    return {
      topic,
      numQuestions,
      questions,
      currentQuestionIndex,
      selectedOption,
      showResult,
      score,
      loading,
      error,
      currentQuestion,
      isLastQuestion,
      resultMessage,
      resultClass,
      startQuiz,
      selectOption,
      submitAnswer,
      nextQuestion
    };
  }
};
</script>

<style>
.box {
  width: 100px;
  height: 100px;
  background-color: red;
  margin: 20px;
}
</style>
