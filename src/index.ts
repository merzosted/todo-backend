import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import todoRoutes from './routes/todo.routes.js';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);



// Todo routes
app.use('/api/todos', todoRoutes);

// Base route
app.use('/', (req, res) => {
  res.send('API is running...');
});

// Connect DB and start server
connectDB();
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});