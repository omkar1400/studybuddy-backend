const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');

// ─── Environment ────────────────────────────────────────────────────────────
// Must be called before any process.env access
dotenv.config();

// ─── Route Imports ──────────────────────────────────────────────────────────
const userRoutes    = require('./routes/users');
const subjectRoutes = require('./routes/subjects');
const sessionRoutes = require('./routes/sessions');

// ─── App Initialisation ─────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Global Middleware ──────────────────────────────────────────────────────
app.use(cors());                               // Enable Cross-Origin Resource Sharing
app.use(express.json());                       // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// ─── Health-check / Root Route ──────────────────────────────────────────────
// Confirms the API is online and lists available base paths
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

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/users',    userRoutes);    // User auth + CRUD
app.use('/api/subjects', subjectRoutes); // Subject CRUD (JWT-protected)
app.use('/api/sessions', sessionRoutes); // Study-session CRUD (JWT-protected)

// ─── 404 Handler ────────────────────────────────────────────────────────────
// Catches any request that did not match a registered route above.
// Must come BEFORE the error handler so unmatched routes return 404, not 500.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ─── Global Error Handler ───────────────────────────────────────────────────
// Must have exactly 4 parameters so Express identifies it as an error handler.
// Catches errors forwarded via next(err) from any route or middleware.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong!'
  });
});

// ─── Start Server ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 StudyBuddy API running on http://localhost:${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
