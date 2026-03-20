const express = require('express');
const connectDB = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1', routes);

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
    console.log('\nMVC Structure:');
    console.log('  models/      - Mongoose schemas');
    console.log('  controllers/ - Request handlers');
    console.log('  services/    - Business logic');
    console.log('  routes/      - API routes');
  });
}

startServer();
