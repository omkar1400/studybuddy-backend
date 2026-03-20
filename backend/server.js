const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const userRoutes = require('./routes/users');
const subjectRoutes = require('./routes/subjects');
const sessionRoutes = require('./routes/sessions');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to StudyBuddy API',
    version: '1.0.0',
    endpoints: {
      users:    '/api/users',
      subjects: '/api/subjects',
      sessions: '/api/sessions'
    }
  });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/sessions', sessionRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong!'
  });
});

// start server
app.listen(PORT, () => {
  console.log(`🚀 StudyBuddy API running on http://localhost:${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
