// server.js

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { generateQuestions } = require('./questionGenerator');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
console.log(process.env.MONGODB_URL);
app.use(cors());
app.use(express.json());

const uri =
  'mongodb+srv://schumaecker:asdlkjcn@question-generator.w9s6z.mongodb.net/?retryWrites=true&w=majority&appName=question-generator';
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    db = client.db('question-generator'); // You can change the database name if needed
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
    process.exit(1);
  }
}

connectToDatabase();

app.get('/api/generateQuestion', async (req, res) => {
  const topic = req.query.topic;
  const numQuestions = parseInt(req.query.numQuestions) || 1;

  if (!topic) {
    return res.status(400).json({ error: 'Missing topic parameter' });
  }

  try {
    const questions = await generateQuestions(topic, numQuestions);
    res.json(questions);
  } catch (error) {
    console.error('Error generating quiz question:', error);
    res.status(500).json({ error: 'Failed to generate quiz questions' });
  }
});

app.post('/api/submitQuestion', async (req, res) => {
  try {
    const question = req.body;
    const result = await db.collection('questions').insertOne(question);
    res.status(201).json({
      message: 'Question submitted successfully',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Error submitting question:', error);
    res.status(500).json({ error: 'Failed to submit question' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
