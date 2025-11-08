import mongoose from "mongoose";

const secretSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Введіть заголовок секрету"],
    trim: true,
    minlength: [3, "Заголовок повинен містити не менше 3 символів"],
    maxlength: [100, "Заголовок не повинен перевищувати 100 символів"],
  },
  content: {
    type: String,
    required: [true, "Введіть вміст секрету"],
    minlength: [10, "Вміст секрету не може бути порожнім"],
    maxlength: [10000, "Вміст секрету не повинен перевищувати 10000 символів"],
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  showAuthor: { 
    type: Boolean, 
    default: false 
  },

  stars: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: []
  }],
  reports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: []
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
});

secretSchema.virtual('starCount').get(function() {
  return this.stars?.length || 0;
});
secretSchema.virtual('reportCount').get(function() {
  return this.reports?.length || 0;
});


secretSchema.index({ isActive: 1 });
secretSchema.index({ author: 1 });

secretSchema.set('toJSON', { virtuals: true });
secretSchema.set('toObject', { virtuals: true });
export default mongoose.model('Secret', secretSchema);