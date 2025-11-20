/**
 * Main server file for Todo API
 * Sets up Express server with middleware, routes, and database connection
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import todoRoutes from './routes/todo.routes.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing for frontend communication
app.use(express.json()); // Parse incoming JSON request bodies

// API Routes
app.use('/api/auth', authRoutes); // Authentication routes (signup, login, password reset)
app.use('/api/todos', todoRoutes); // Todo CRUD routes (protected by auth middleware)

// Health check endpoint to verify server is running
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Base route for API root
app.get('/', (req, res) => {
  res.send('Todo API is running...');
});

// Global error handler middleware (must be registered last)
// Catches all errors and logs them to MongoDB
app.use(errorHandler);

// Connect to MongoDB database
connectDB();

// Get port from environment variables or use default
const PORT = process.env.PORT || 5000;

// Start the server and listen on specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});