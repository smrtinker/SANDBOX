import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import testRoutes from './routes/testRoute.js';
import astroRoutes from './routes/astroRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Check required environment variables
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in the environment variables.');
    process.exit(1);
}
if (!process.env.PORT) {
    console.error('PORT is not defined in the environment variables.');
    process.exit(1);
}

const app = express();

// Enhanced request logging middleware
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: {
      'content-type': req.headers['content-type'],
      'authorization': req.headers['authorization'] ? 'Bearer [hidden]' : 'none'
    }
  });
  next();
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Add your frontend URL
  credentials: true
}));
app.use(express.json());

// Test middleware to verify JSON parsing
app.use((req, res, next) => {
  if (req.method === 'POST' && !req.body) {
    console.warn('Warning: POST request with no body');
  }
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/test', testRoutes);
app.use('/api/astro', astroRoutes);

// Root route with error handling
app.get('/', (req, res) => {
  try {
    res.json({ message: 'Welcome to the SANDBOX API' });
  } catch (error) {
    console.error('Error in root route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Welcome route with enhanced error handling
app.get('/api/welcome', (req, res) => {
  try {
    console.log('Handling welcome request');
    res.json({ 
      message: 'Welcome to the SANDBOX API!',
      status: 'success',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  } catch (error) {
    console.error('Error in welcome route:', error);
    res.status(500).json({ 
      message: 'Error processing welcome request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Enhanced 404 handler
app.use((req, res, next) => {
  console.log('404 Error:', {
    method: req.method,
    path: req.path,
    body: req.body
  });
  res.status(404).json({ 
    message: "Sorry, that route does not exist.",
    requested_path: req.path
  });
});

// Enhanced error handler
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });

  // Send appropriate error response
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? {
      stack: err.stack,
      details: err.toString()
    } : { message: 'Internal server error' }
  });
});

// Connect to database and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Available routes:');
    app._router.stack.forEach((r) => {
      if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods).join(', ').toUpperCase()} ${r.route.path}`);
      }
    });
  });
}).catch(error => {
  console.error('Failed to connect to the database:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

export default app;