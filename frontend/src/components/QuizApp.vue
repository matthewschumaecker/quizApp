<template>
  <div class="quiz-app">
    <h2>Quiz App</h2>

    <div class="input-container">
      <div class="input-group">
        <label for="topic">Topic:</label>
        <input id="topic" v-model="topic" placeholder="Enter quiz topic" />
      </div>
      <div class="input-group">
        <label for="numQuestions">Number of Questions:</label>
        <input
          id="numQuestions"
          v-model.number="numQuestions"
          type="number"
          min="1"
          max="10"
        />
      </div>
      <button @click="startQuiz" :disabled="!topic || numQuestions < 1">
        Start Quiz
      </button>
    </div>

    <div v-if="currentQuestion" class="question-container">
      <p class="question-text">{{ currentQuestion.text }}</p>
      <ul class="options-list">
        <li
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          :class="{ selected: selectedOption === index }"
          @click="selectOption(index)"
        >
          {{ option }}
        </li>
      </ul>
      <button @click="submitAnswer" :disabled="selectedOption === null">
        Submit Answer
      </button>
    </div>

    <p v-if="showResult" :class="resultClass">{{ resultMessage }}</p>
    <p v-if="showResult" class="explanation">
      {{ currentQuestion.explanation }}
    </p>

    <button v-if="showResult && !isLastQuestion" @click="nextQuestion">
      Next Question
    </button>

    <p v-if="isLastQuestion && showResult" class="final-score">
      Your final score is: {{ score }}/{{ questions.length }}
    </p>

    <p v-if="loading">Loading questions...</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import axios from 'axios';

export default {
  name: 'QuizApp',
  setup() {
    const topic = ref('');
    const numQuestions = ref(5); // Default to 5 questions
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
        ? 'correct'
        : 'incorrect'
    );

    const startQuiz = async () => {
      if (!topic.value || numQuestions.value < 1) return;

      try {
        loading.value = true;
        error.value = null;
        const response = await axios.get(
          'http://localhost:3000/api/generateQuestion',
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

<style scoped>
.quiz-app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

label {
  margin-bottom: 5px;
}

input {
  padding: 8px;
  font-size: 16px;
  width: 200px;
  max-width: 100%;
  text-align: center;
}

input[type='number'] {
  width: 100px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

label {
  margin-bottom: 5px;
}

.question-container {
  margin-top: 20px;
}

.question-text {
  font-size: 18px;
  margin-bottom: 15px;
}

.options-list {
  list-style-type: none;
  padding: 0;
}

.options-list li {
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 5px;
  cursor: pointer;
}

.options-list li.selected {
  background-color: #e0e0e0;
}

.correct {
  color: green;
}

.incorrect {
  color: red;
}

.explanation {
  font-style: italic;
  margin-top: 10px;
}

.final-score {
  font-weight: bold;
  font-size: 18px;
  margin-top: 20px;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
