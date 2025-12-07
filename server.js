const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const reportsRouter = require('./routes/reports');

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL // Add your Vercel URL here via environment variable
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/reports', reportsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('=== ERROR ===');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('=============');
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/civic_tech';

async function start() {
  try {
    await mongoose.connect(MONGO_URI, { autoIndex: true });
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
}

start();
