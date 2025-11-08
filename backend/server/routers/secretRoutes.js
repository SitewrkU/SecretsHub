import express from "express";
import Secret from "../models/Secret.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

const router = express.Router();

const createSecretLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: { message: "Занадто багато спроб створення секретів з цього IP, будь ласка, спробуйте пізніше." }
});

const actionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 300,
  message: { message: "Занадто багато запитів з цього IP, будь ласка, спробуйте пізніше." }
});


router.post('/', authMiddleware, createSecretLimiter, async (req, res) => {
  try {
    const { title, content, showAuthor = false } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Всі поля є обов'язковими." });
    }

    const secret = await Secret.create({
      title,
      content,
      author: req.user._id,
      showAuthor: Boolean(showAuthor)
    });

    await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { 'stats.totalSecrets': 1 } },
      { new: true }
    );

    res.status(201).json({ 
      message: `Секрет успішно створено. ID: ${secret._id}`,
      secret: {
        id: secret._id,
        title: secret.title,
        stars: secret.starCount,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера." });
  }
});



router.post('/getRandom', authMiddleware, actionLimiter, async (req, res) => {
  try {
    const count = await Secret.countDocuments({ isActive: true });

    if (count === 0) {
      return res.status(404).json({ message: "Немає доступних секретів." });
    }

    const random = Math.floor(Math.random() * count);
    const randomSecret = await Secret.findOne({ isActive: true }).skip(random).lean();;

    if (!randomSecret) {
      return res.status(404).json({ message: "Немає доступних секретів." });
    }

    const hasLiked = Array.isArray(randomSecret.stars) && randomSecret.stars.length > 0
      ? randomSecret.stars.some(id => id.toString() === req.user._id.toString())
      : false;

    const hasReported = Array.isArray(randomSecret.reports) && randomSecret.reports.length > 0
      ? randomSecret.reports.some(id => id.toString() === req.user._id.toString())
      : false;

    
    let authorName = null;
    if (randomSecret.showAuthor) {
      const author = await User.findById(randomSecret.author).select('name');
      authorName = author ? author.name : null;
    }


    res.json({
      id: randomSecret._id,
      title: randomSecret.title,
      content: randomSecret.content,
      starCount: randomSecret.stars?.length || 0,
      reportCount: randomSecret.reports?.length || 0,
      hasLiked: hasLiked,
      hasReported: hasReported,
      createdAt: randomSecret.createdAt,
      author: authorName
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера." });
  }
});



router.post('/:id/star', authMiddleware, actionLimiter, async (req, res) => {
  try {
    const secretId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(secretId)) {
      return res.status(400).json({ message: 'Некоректний ID секрету' });
    }

    const secret = await Secret.findById(secretId);
    if (!secret) {
      return res.status(404).json({ message: 'Секрет не знайдено' });
    }

    const hasLiked = secret.stars.some(id => id.toString() === userId.toString());

    if (hasLiked) {
      secret.stars = secret.stars.filter(id => id.toString() !== userId.toString());
    } else {
      secret.stars.push(userId);
    }

    await secret.save();

    const author = await User.findById(secret.author);

    if(author){
      const increment = hasLiked ? -1 : 1;
      author.stats.totalStars = (author.stats.totalStars || 0) + increment;
      await author.save();
    }
    res.json({
      message: hasLiked ? 'Зірку видалено' : 'Зірку добавлено',
      starCount: secret.stars.length,
      hasLiked: !hasLiked
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера." });
  }
});


router.post('/:id/report', authMiddleware, actionLimiter, async (req, res) => {
  try {
    const secretId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(secretId)) {
      return res.status(400).json({ message: 'Некоректний ID секрету' });
    }

    const secret = await Secret.findById(secretId);
    if (!secret || !secret.isActive) {
      return res.status(404).json({ message: 'Секрет не знайдено' });
    }

    if (secret.author.toString() === userId.toString()) {
      return res.status(400).json({ message: 'Не можна репортити власний секрет' });
    }

    if(secret.reports.some(id => id.toString() === userId.toString())){
      return res.status(400).json({ message: 'Ви вже повідомили про цей секрет' });
    }


    const hasReported = secret.reports.some(id => id.toString() === userId.toString());

    secret.reports.push(userId);
    await secret.save();

    const author = await User.findById(secret.author);
    if(author){
      author.stats.totalReports = (author.stats.totalReports || 0) + 1;
      await author.save();
    }

    const shouldHide = shouldHideSecret(secret);
    if(shouldHide){
      secret.isActive = false;
      await secret.save();
      console.log(`Секрет ${secretId} прихований: ${secret.reports.length} репортів, ${secret.stars.length} зірок`);
    }

    res.json({
      message: 'Дякуємо за повідомлення',
      reportCount: secret.reports.length,
      isHidden: !secret.isActive,
      hasReported: !hasReported
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера." });
  }
});

function shouldHideSecret(secret) {
  const reportCount = secret.reports.length;
  const starCount = secret.stars.length;

  if (reportCount < 5) {
    return false;
  }
  return reportCount > starCount * 1.5;
}


router.get('/my', authMiddleware, async (req, res) => {
  try {
    const secrets = await Secret.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .select('title stars reports isActive createdAt showAuthor')
      .lean();

    const secretList = secrets.map(secret => ({
      id: secret._id,
      title: secret.title,
      starCount: secret.stars?.length || 0,
      reportCount: secret.reports?.length || 0,
      isActive: secret.isActive,
      createdAt: secret.createdAt,
      showAuthor: secret.showAuthor
    }));

    res.json({ secrets: secretList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера." });
  }
});


router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ 'stats.totalStars': -1 })
      .limit(20)
      .select('name stats.totalStars stats.totalSecrets')
      .lean();

    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      totalStars: user.stats?.totalStars || 0,
    }));

    res.json({ leaderboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера." });
  }
});



export default router;