import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();

// CORS middleware configuration
app.use(
  cors({
    origin: '*', // We can restrict this in production later
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Simple healthcheck
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Catch-all 404 handler
app.use((_req, res, _next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Centralized error handler
app.use(errorHandler);

export default app;
