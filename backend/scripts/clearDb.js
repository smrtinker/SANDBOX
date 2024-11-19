import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function clearDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Connected to MongoDB. Dropping all collections...');
    const collections = await mongoose.connection.db.collections();
    
    for (let collection of collections) {
      console.log(`Dropping collection: ${collection.collectionName}`);
      await collection.drop().catch(err => {
        if (err.code !== 26) { // 26 is collection doesn't exist error
          console.error(`Error dropping ${collection.collectionName}:`, err);
        }
      });
    }
    
    console.log('All collections dropped successfully');
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

// Run the clear function
clearDatabase();