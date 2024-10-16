// server.js

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const questionRoutes = require('./routes/questionRoutes');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;
const client = new MongoClient(MONGODB_URL);

let db; //MongoDB operator that can access variables defined outside of its expression block

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    db = client.db('question-generator');
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
    process.exit(1);
  }
}

connectToDatabase();

app.use('/api', questionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
