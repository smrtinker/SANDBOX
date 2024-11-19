import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function clearDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Connected. Dropping indexes...');
    await mongoose.connection.collection('users').dropIndexes();
    
    console.log('Indexes dropped. Clearing collection...');
    await mongoose.connection.collection('users').deleteMany({});
    
    console.log('Collection cleared. Disconnecting...');
    await mongoose.disconnect();
    
    console.log('Database cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase();