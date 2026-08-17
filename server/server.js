const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const vectorController = require('./controllers/vectorController');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/semantic_explorer';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB Connection (Graceful connection with fallback)
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('🍃 MongoDB Connected Successfully!'))
  .catch((err) => {
    console.warn('⚠️ MongoDB connection warning (Running in memory-mode):', err.message);
  });

// REST API Endpoints
app.get('/api/health', vectorController.getHealth);
app.post('/api/retrieve', vectorController.retrieveTopK);
app.post('/api/ingest', vectorController.ingestDataset);
app.get('/api/vectors', vectorController.getAllVectors);

// Root Route
app.get('/', (req, res) => {
  res.json({
    project: 'Semantic Image Retrieval & Vector Space Explorer',
    author: 'Tanmay Gupta',
    architecture: 'MERN Stack (MongoDB Atlas Vector Search + Express + React + Node.js)',
    endpoints: {
      health: 'GET /api/health',
      retrieve: 'POST /api/retrieve',
      ingest: 'POST /api/ingest',
      vectors: 'GET /api/vectors'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 MERN Vector Server is running on http://localhost:${PORT}`);
});
