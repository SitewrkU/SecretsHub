import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

async function checkDB() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const secrets = await db.collection('secrets').find({}).limit(5).toArray();
  
  console.log('📊 Перші 5 секретів:');
  secrets.forEach(s => {
    console.log(`ID: ${s._id}`);
    console.log(`  stars:`, s.stars);
    console.log(`  reports:`, s.reports);
    console.log('---');
  });
  
  process.exit(0);
}

checkDB();