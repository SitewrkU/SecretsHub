import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Secret from './server/models/Secret.js'; // Підправ шлях до моделі

dotenv.config();

async function migrateReports() {
  try {
    // Підключення до бази
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Підключено до MongoDB');

    // Знаходимо всі секрети зі старим форматом reports
    // Перевіряємо чи перший елемент масиву - це ObjectId, а не об'єкт
    const secrets = await Secret.find({
      'reports.0': { $exists: true, $not: { $type: 'object' } }
    });

    console.log(`📊 Знайдено ${secrets.length} секретів для міграції`);

    let migrated = 0;
    for (const secret of secrets) {
      // Перевіряємо чи reports - це масив ObjectId
      if (secret.reports.length > 0 && typeof secret.reports[0] !== 'object') {
        secret.reports = secret.reports.map(userId => ({
          userId: userId,
          weight: 1,
          timestamp: new Date()
        }));
        await secret.save();
        migrated++;
        
        if (migrated % 10 === 0) {
          console.log(`✔️ Мігровано ${migrated} секретів...`);
        }
      }
    }

    console.log(`✅ Міграція завершена! Мігровано ${migrated} секретів`);
    
  } catch (error) {
    console.error('❌ Помилка міграції:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 З\'єднання закрито');
    process.exit(0);
  }
}

migrateReports();