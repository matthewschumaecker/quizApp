<template>
  <div class="question-generation">
    <h2>Question Generation</h2>

    <div class="topic-input">
      <label for="topic">Enter Topic:</label>
      <input id="topic" v-model="topic" />
    </div>

    <button @click="generateNewQuestion" :disabled="loading || !topic">
      Generate New Question
    </button>

    <div v-if="currentQuestion">
      <h3>Current Question:</h3>
      <p class="question-text">{{ currentQuestion.text }}</p>
      <ul class="options-list">
        <li v-for="(option, index) in currentQuestion.options" :key="index">
          {{ option }}
        </li>
      </ul>
      <p>
        <strong>Correct Answer:</strong>
        {{ currentQuestion.options[currentQuestion.correctAnswer] }}
      </p>
      <p class="explanation">{{ currentQuestion.explanation }}</p>
    </div>

    <div v-if="currentQuestion">
      <h3>Feedback:</h3>
      <textarea
        v-model="feedback"
        rows="4"
        cols="50"
        placeholder="Instructions to reformulate question..."
      ></textarea>
      <br />
      <button @click="requestChanges">Request Changes</button>
      <button @click="submitToDatabase">Submit to Database</button>
    </div>

    <p v-if="loading">Generating question...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <!-- New section for editable JSON -->
    <div v-if="currentQuestion" class="json-edit">
      <h4>Edit Question JSON:</h4>
      <textarea
        v-model="editableJson"
        rows="10"
        class="json-textarea"
      ></textarea>
      <br />
      <button @click="updateQuestionFromJson">Update Question</button>
      <button @click="submitJsonToDatabase">Submit JSON to Database</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import axios from 'axios';

export default {
  name: 'QuestionGeneration',
  setup() {
    const currentQuestion = ref(null);
    const feedback = ref('');
    const loading = ref(false);
    const error = ref(null);
    const topic = ref('');
    const editableJson = ref('');

    const currentQuestionJson = computed(() => {
      return currentQuestion.value
        ? JSON.stringify([currentQuestion.value], null, 2)
        : '';
    });

    watch(currentQuestion, (newQuestion) => {
      if (newQuestion) {
        editableJson.value = JSON.stringify([newQuestion], null, 2);
      } else {
        editableJson.value = '';
      }
    });

    const generateNewQuestion = async () => {
      if (!topic.value) {
        error.value = 'Please enter a topic';
        return;
      }
      try {
        loading.value = true;
        error.value = null;
        const response = await axios.get(
          'http://localhost:3000/api/generateQuestion',
          {
            params: { topic: topic.value, numQuestions: 1 }
          }
        );
        currentQuestion.value = response.data[0];
        editableJson.value = JSON.stringify([response.data[0]], null, 2);
        feedback.value = '';
      } catch (err) {
        error.value = 'Failed to generate question';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const requestChanges = async () => {
      if (!currentQuestion.value) return;
      try {
        loading.value = true;
        error.value = null;
        const response = await axios.post(
          'http://localhost:3000/api/modifyQuestion',
          {
            question: currentQuestion.value,
            feedback: feedback.value
          }
        );
        currentQuestion.value = response.data;
        editableJson.value = ''; // Clear editable JSON when question is modified
        feedback.value = '';
      } catch (err) {
        error.value = 'Failed to modify question';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const submitToDatabase = async () => {
      if (!currentQuestion.value) return;
      try {
        loading.value = true;
        error.value = null;
        await axios.post(
          'http://localhost:3000/api/submitQuestion',
          currentQuestion.value
        );
        currentQuestion.value = null;
        editableJson.value = '';
        feedback.value = '';
        topic.value = '';
      } catch (err) {
        error.value = 'Failed to submit question to database';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const updateQuestionFromJson = () => {
      try {
        const parsedJson = JSON.parse(editableJson.value);
        if (Array.isArray(parsedJson) && parsedJson.length > 0) {
          currentQuestion.value = parsedJson[0];
          error.value = null;
        } else {
          throw new Error(
            'Invalid JSON structure. Expected an array with at least one question object.'
          );
        }
      } catch (err) {
        error.value = `Failed to parse JSON: ${err.message}`;
      }
    };

    const submitJsonToDatabase = async () => {
      try {
        const parsedJson = JSON.parse(editableJson.value);
        if (Array.isArray(parsedJson) && parsedJson.length > 0) {
          loading.value = true;
          error.value = null;
          await axios.post(
            'http://localhost:3000/api/submitQuestion',
            parsedJson[0]
          );
          currentQuestion.value = null;
          editableJson.value = '';
          feedback.value = '';
          topic.value = '';
        } else {
          throw new Error(
            'Invalid JSON structure. Expected an array with at least one question object.'
          );
        }
      } catch (err) {
        error.value = `Failed to submit JSON to database: ${err.message}`;
      } finally {
        loading.value = false;
      }
    };

    return {
      currentQuestion,
      feedback,
      loading,
      error,
      topic,
      editableJson,
      currentQuestionJson,
      generateNewQuestion,
      requestChanges,
      submitToDatabase,
      updateQuestionFromJson,
      submitJsonToDatabase
    };
  }
};
</script>

<style scoped>
.question-generation {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.topic-input {
  margin-bottom: 20px;
}

.topic-input label {
  margin-right: 10px;
}

.topic-input input {
  width: 300px;
  padding: 5px;
}

textarea {
  width: 100%;
  margin-bottom: 10px;
}

button {
  margin-right: 10px;
  margin-bottom: 10px;
}

.error {
  color: red;
}

.json-edit {
  margin-top: 20px;
}

.json-textarea {
  width: 100%;
  min-height: 300px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 10px;
  box-sizing: border-box;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  resize: vertical;
}
</style>
