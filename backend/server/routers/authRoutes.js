import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: "Всі поля є обов'язковими." });
    }

    const existingUser = await User.findOne({ name });
    if(existingUser) {
      return res.status(400).json({message: "Користувач з таким юзом вже існує."})
    }

    const user = await User.create({ name, password });

    const token = jwt.sign(
      {userId: user._id},
      process.env.JWT_SECRET,
      {expiresIn: '7d'}
    )

    res.status(201).json(
      { token, 
        user: { 
          id: user._id, 
          userId: user.userId,
          name: user.name 
        } 
      }
    );

  } catch (err) {
    res.status(500).json({ message: "Помилка сервера." });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: "Всі поля є обов'язковими." });
    }

    const user = await User.findOne({name});
    if(!user) {
      return res.status(400).json({message: "Неправильний юз або пароль."})
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(400).json({message: "Неправильний юз або пароль."})
    }

    const token = jwt.sign(
      {userId: user._id},
      process.env.JWT_SECRET,
      {expiresIn: '7d'}
    )
    res.status(200).json(
      { token, 
        user: { 
          id: user._id, 
          userId: user.userId,
          name: user.name 
        } 
      }
    );

  } catch (err) {
    res.status(500).json({ message: "Помилка сервера." });
  }
});

export default router;