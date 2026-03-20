const express = require('express');
const connectDB = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: { message: 'Route not found', code: 'NOT_FOUND' }
  });
});

// Error handler
app.use(errorHandler);

// Start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`);
    console.log('\n📚 Chapter 9 - Mongoose Population APIs:');
    console.log('  Bài 1: GET /api/v1/bookings/:id');
    console.log('  Bài 2: GET /api/v1/users/:id/bookings');
    console.log('  Bài 3: GET /api/v1/owner/bookings (x-user-id header)');
    console.log('  Bài 4: GET /api/v1/admin/bookings/summary');
  });
}

startServer();
