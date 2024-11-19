const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

// Create project structure
console.log('Creating project structure...');
['backend', 'frontend'].forEach(dir => {
  fs.mkdirSync(path.join(rootDir, dir), { recursive: true });
});

// Initialize root package.json
console.log('Initializing root package.json...');
execSync('npm init -y');
const rootPackageJson = {
  "name": "sandbox",
  "version": "1.0.0",
  "scripts": {
    "start": "npm run start:backend & npm run start:frontend",
    "start:backend": "cd backend && npm run dev",
    "start:frontend": "cd frontend && npm run dev",
    "install:all": "npm install && cd backend && npm install && cd ../frontend && npm install",
    "dev": "concurrently \"npm run start:backend\" \"npm run start:frontend\""
  },
  "dependencies": {
    "dotenv": "^10.0.0",
    "axios": "^0.21.1"
  },
  "devDependencies": {
    "concurrently": "^6.2.0"
  }
};
fs.writeFileSync('package.json', JSON.stringify(rootPackageJson, null, 2));

// Set up backend
console.log('Setting up backend...');
process.chdir(path.join(rootDir, 'backend'));
execSync('npm init -y');
execSync('npm install express mongoose dotenv jsonwebtoken cors');
execSync('npm install --save-dev nodemon');

const backendPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
backendPackageJson.type = "module";
backendPackageJson.scripts = {
  "start": "node server.js",
  "dev": "nodemon server.js"
};
fs.writeFileSync('package.json', JSON.stringify(backendPackageJson, null, 2));

// Create backend files
const serverCode = `
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import { authenticateUser } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(authenticateUser);

// Routes
app.use('/api/users', userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error.message));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SANDBOX API' });
});

// Start the server
app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}\`);
});
`;
fs.writeFileSync('server.js', serverCode);

// Create necessary directories
fs.mkdirSync('models', { recursive: true });
fs.mkdirSync('routes', { recursive: true });
fs.mkdirSync('middleware', { recursive: true });

const userModelCode = `
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);
export default User;
`;
fs.writeFileSync('models/User.js', userModelCode);

const userRoutesCode = `
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Example route to create a user
router.post('/create', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

export default router;
`;
fs.writeFileSync('routes/userRoutes.js', userRoutesCode);

const authMiddlewareCode = `
import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization');
  
  // Allow requests without a token (for development purposes)
  if (!token) {
    console.log('No token provided, proceeding without authentication');
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
`;
fs.writeFileSync('middleware/auth.js', authMiddlewareCode);

// Set up frontend
console.log('Setting up frontend with Vite...');
process.chdir(path.join(rootDir, 'frontend'));
execSync('npm create vite@latest . -- --template react');
execSync('npm install');

const frontendPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
frontendPackageJson.scripts = {
  ...frontendPackageJson.scripts,
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
};
fs.writeFileSync('package.json', JSON.stringify(frontendPackageJson, null, 2));

// Create vite.config.js for proxy setup
const viteConfig = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
`;
fs.writeFileSync('vite.config.js', viteConfig);

// Update App.jsx
const appCode = `
import React, { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => setMessage('Error fetching data'))
  }, [])

  return (
    <div className="App">
      <h1>SANDBOX</h1>
      <p>{message || 'Loading...'}</p>
    </div>
  )
}

export default App
`;
fs.writeFileSync('src/App.jsx', appCode);

// Create .env file
console.log('Creating .env file...');
process.chdir(rootDir);
const envContent = `
MONGODB_URI=mongodb+srv://DBUSER:l8FZw64GrXfFtKNx@cluster0.5qqgf.mongodb.net/SANDBOX 
PORT=5000
JWT_SECRET=k34%^&&*ewhrkhnw323205ois:[oiqeropier]
`;
fs.writeFileSync('.env', envContent);

console.log('MERN stack project setup complete!');
console.log('To install all dependencies, run: npm run install:all');
console.log('To start the development servers, run: npm run dev');