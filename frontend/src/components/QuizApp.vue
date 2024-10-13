<template>
  <div class="quiz-app">
    <p class="question-text" v-if="currentQuestion">
      {{ currentQuestion.text }}
    </p>

    <ul class="options-list" v-if="currentQuestion">
      <li
        v-for="(option, index) in currentQuestion.options"
        :key="index"
        :class="{ selected: selectedOption === index }"
        @click="selectOption(index)"
      >
        {{ option }}
      </li>
    </ul>

    <button
      v-if="currentQuestion"
      @click="submitAnswer"
      :disabled="selectedOption === null"
    >
      Submit
    </button>

    <p v-if="showResult" :class="resultClass" class="result">
      {{ resultMessage }}
    </p>
    <p
      class="explanation"
      v-if="showResult"
      v-html="currentQuestion.explanation"
    ></p>

    <button v-if="showResult && !isLastQuestion" @click="nextQuestion">
      Next Question
    </button>

    <p v-if="isLastQuestion && showResult" class="final-score">
      Your final score is: {{ score }}/{{ questions.length }}
    </p>

    <p v-if="loading" class="loading">Loading questions...</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      questions: [],
      currentQuestionIndex: 0,
      selectedOption: null,
      showResult: false,
      score: 0,
      loading: false,
      error: null
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
    resultMessage() {
      return this.selectedOption === this.currentQuestion.correctAnswer
        ? 'Correct'
        : 'Incorrect';
    },
    resultClass() {
      return this.selectedOption === this.currentQuestion.correctAnswer
        ? 'correct'
        : 'incorrect';
    },
    isLastQuestion() {
      return this.currentQuestionIndex === this.questions.length - 1;
    }
  },
  methods: {
    selectOption(index) {
      this.selectedOption = index;
    },
    submitAnswer() {
      console.log(`User chose: ${this.selectedOption}`);
      console.log(`Correct answer: ${this.currentQuestion.correctAnswer}`);
      const correctAnswerIndex = Number(this.currentQuestion.correctAnswer);
      if (this.selectedOption === correctAnswerIndex) {
        this.score++;
      }
      this.showResult = true;
    },
    nextQuestion() {
      this.currentQuestionIndex++;
      this.selectedOption = null;
      this.showResult = false;
    },
    async fetchQuestion() {
      try {
        this.loading = true;
        const response = await axios.get(
          'http://localhost:3000/api/generateQuestion',
          {
            params: {
              topic: 'cardiac genetics',
              numQuestions: 5
            }
          }
        );
        this.questions.push(response.data);
        console.log(response.data);
      } catch (error) {
        this.error = 'Failed to load questions';
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    this.fetchQuestion(); // Fetch question(s) when the component is created
  }
};
</script>

<style scoped>
.quiz-app {
  font-family: Arial, sans-serif;
}

.options-list {
  list-style-type: none;
  padding: 0;
  text-align: left;
}

.options-list li {
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  cursor: pointer;
}

.options-list li.selected {
  background-color: #d3d3d3;
}

button {
  margin-top: 20px;
}

/* make it so incorrect red and correct blue */
.result {
  font: 1.3em sans-serif;
  margin-top: 20px;
  font-weight: bold;
}

.result.correct {
  color: #2a0eb5; /* Blue for correct answers */
}

.result.incorrect {
  color: #c92a3d; /* Red for incorrect answers */
}

.final-score {
  margin-top: 30px;
  font-size: 1.2em;
}

.loading {
  margin-top: 20px;
  font-size: 1.2em;
}

.error {
  color: red;
  margin-top: 20px;
}

.question-text {
  font-size: 1.1em;
  text-align: left;
  padding: 10px;
  margin-bottom: 35px;
}
.explanation {
  margin-top: 10px;
  padding: 10px;
  text-align: left;
}
</style>
