const express = require('express');
const router = express.Router();
const { generateQuestions } = require('../questionGenerator');


let mostRecentQuestion = null;

// Generate quiz questions route
router.get('/generateQuestion', async (req, res) => {
  const topic = req.query.topic;
  const numQuestions = parseInt(req.query.numQuestions) || 1;

  if (!topic) {
    return res.status(400).json({ error: 'Missing topic parameter' });
  }

  try {
    const questions = await generateQuestions(topic, numQuestions);
    mostRecentQuestion = questions;
    res.json(questions);
  } catch (error) {
    console.error('Error generating quiz question:', error);
    res.status(500).json({ error: 'Failed to generate quiz questions' });
  }
  //   finally {
  //     console.log(`Most recent Question: ${JSON.stringify(mostRecentQuestion)}`);
  //   }
});
//test to see if backend is working
router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});
// Submit question route
router.post('/submitQuestion', async (req, res) => {
  const db = req.app.locals.db;
  if (!db) {
    console.log('Database connection not available');
    return res.status(500).json({ error: 'Database connection not available' });
  }
  try {
    const question = req.body;
    const result = await db.collection('questions').insertOne(question);
    console.log(
      'Question submitted successfully to database:',
      result.insertedId
    );
    res.status(201).json({
      message: 'Question submitted successfully to database.',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Error submitting question:', error);
    res.status(500).json({ error: 'Failed to submit question' });
  }
});

router.get('/refineQuestion', async (req, res) => {
  console.log('Refining question...');
  const feedback = req.query.feedback;
  if (!feedback) {
    return res.status(400).json({ error: 'Missing feedback parameter' });
  }
  try {
    const refinedQuestion = await refineQuestion(feedback);
    res.json(refinedQuestion);
  } catch (error) {
    console.error('Error refining question at the server level:', error);
    res.status(500).json({ error: 'Failed to refine question' });
  }
});
(module.exports = router), mostRecentQuestion;
