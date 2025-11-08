import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import IdCounter from "./IdCounter.js";

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Введіть ваш юзернейм"],
    unique: true,
    trim: true,
    minlength: [3, "Ім'я повинно містити не менше 3 символів"],
    maxlength: [15, "Ім'я не повинно перевищувати 15 символів"],
    validate : {
      validator: function(v) {
        return /^[a-zA-Z0-9_]+$/.test(v);
      },
      message: props => `${props.value} містить недопустимі символи. Використовуйте лише літери, цифри та підкреслення.`
    },
  },
  password: {
    type: String,
    required: [true, "Введіть пароль"],
    minlength: [6, "Пароль повинен містити не менше 6 символів"],
    maxlength: [64, "Пароль повинен містити не більше 64 символів"],
  },
  stats: {
    totalStars: {
      type: Number,
      default: 0
    },
    totalSecrets: {
      type: Number,
      default: 0
    },
    totalReports: {
      type: Number,
      default: 0
    },

  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Автоінкремент userId
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await IdCounter.findByIdAndUpdate(
        { _id: 'userId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.userId = counter.seq;
      next();
    } catch (err) {
      next(err);
    }
  }else{
    next();
  }
})



// Хешування
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  next();
});

export default mongoose.model("User", userSchema);