const express = require('express');
const cors = require('cors');
const { askQuizQuestion } = require('./questionGenerator');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes and origins
app.use(cors());

// Define the route to generate a quiz question
app.get('/api/generateQuestion', async (req, res) => {
  const topic = req.query.topic;
  const numQuestions = parseInt(req.query.numQuestions) || 1;

  if (!topic) {
    return res.status(400).json({ error: 'Missing topic parameter' });
  }

  try {
    const question = await askQuizQuestion(topic, numQuestions);
    res.json(question);
  } catch (error) {
    console.error('Error generating quiz question:', error);
    res.status(500).json({ error: 'Failed to generate quiz question' });
  }
});

// Start the server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
