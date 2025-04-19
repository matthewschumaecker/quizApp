// server.js

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const questionRoutes = require('./routes/questionRoutes');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error('MONGODB_URL is not defined in environment variables');
  process.exit(1);
}

const client = new MongoClient(MONGODB_URL, {
  // Current recommended options for MongoDB Node.js Driver 4.x
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,    // Close sockets after 45 seconds of inactivity
  family: 4                  // Use IPv4, skip trying IPv6
});

async function startServer() {
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db('question-generator');
    app.locals.db = db; // Store db instance in app.locals for route access

    app.use('/api', questionRoutes);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    await client.close();
    process.exit(1);
  }
}

// Error handling for uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('Uncaught Exception:', error);
  await client.close();
  process.exit(1);
});

// Graceful shutdown handlers
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown(signal) {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  try {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}
app.use(express.static(path.join(__dirname, '../client/dist')));

// API routes
app.use('/api', questionRoutes);

// Catch-all for Vue Router history mode
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
// Start the server
startServer().catch(console.error);