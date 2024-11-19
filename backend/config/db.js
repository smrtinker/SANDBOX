import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Log the MongoDB URI (without sensitive credentials)
    const maskedURI = process.env.MONGODB_URI.replace(
      /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
      'mongodb$1://***:***@'
    );
    console.log('Attempting to connect to MongoDB:', maskedURI);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Set up connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connection established');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose connection disconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('Mongoose connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing mongoose connection:', err);
        process.exit(1);
      }
    });

    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Check for specific error types
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to any MongoDB server.');
      console.error('Please check:');
      console.error('1. MongoDB URI is correct');
      console.error('2. MongoDB server is running');
      console.error('3. Network connectivity');
      console.error('4. Firewall settings');
    }
    
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set!');
    }

    process.exit(1);
  }
};

// Add a function to check connection status
export const checkDBConnection = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[state] || 'unknown';
};

export default connectDB;