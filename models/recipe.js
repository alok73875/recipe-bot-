const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    ingredients: [
      {
        name: { type: String, required: true },
        amount: { type: String, required: true },
        unit: { type: String, required: true },
        optional: { type: Boolean, default: false },
      },
    ],
    instructions: [
      {
        step: { type: Number, required: true },
        description: { type: String, required: true },
        duration: { type: Number, default: 0 }, // in minutes
        tip: { type: String },
      },
    ],
    cookingTime: {
      prep: { type: Number, required: true },
      cook: { type: Number, required: true },
      total: { type: Number, required: true },
    },
    servings: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    dietary: [
      {
        type: String,
        enum: [
          'vegetarian',
          'vegan',
          'keto',
          'gluten-free',
          'dairy-free',
          'nut-free',
        ],
      },
    ],
    cuisine: {
      type: String,
      enum: [
        'Italian',
        'Mexican',
        'Asian',
        'American',
        'Mediterranean',
        'Indian',
        'Other',
      ],
    },
    category: {
      type: String,
      enum: [
        'breakfast',
        'lunch',
        'dinner',
        'snack',
        'dessert',
        'appetizer',
      ],
    },
    nutrition: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number,
    },
    tags: [String],
    image: {
      type: String,
      default: '',
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    cookCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
recipeSchema.index({ name: 'text', description: 'text', tags: 'text' });
recipeSchema.index({ 'ingredients.name': 1 });
recipeSchema.index({ dietary: 1 });
recipeSchema.index({ 'cookingTime.total': 1 });
recipeSchema.index({ difficulty: 1 });
recipeSchema.index({ category: 1 });
recipeSchema.index({ 'rating.average': -1 });
recipeSchema.index({ createdAt: -1 });

// Virtual for total cooking time calculation
recipeSchema.virtual('totalTime').get(function () {
  return this.cookingTime.prep + this.cookingTime.cook;
});

// Method to add to favorites
recipeSchema.methods.addToFavorites = function (userId) {
  if (!this.favorites.includes(userId)) {
    this.favorites.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove from favorites
recipeSchema.methods.removeFromFavorites = function (userId) {
  this.favorites = this.favorites.filter((id) => !id.equals(userId));
  return this.save();
};

// Static method to find recipes by ingredients
recipeSchema.statics.findByIngredients = function (ingredients) {
  return this.find({
    'ingredients.name': {
      $in: ingredients.map((ing) => new RegExp(ing, 'i')),
    },
  });
};

// Static method to find recipes by dietary restrictions
recipeSchema.statics.findByDietary = function (dietary) {
  return this.find({ dietary: { $in: dietary } });
};

// Pre-save middleware to calculate total time
recipeSchema.pre('save', function (next) {
  if (this.cookingTime.prep && this.cookingTime.cook) {
    this.cookingTime.total = this.cookingTime.prep + this.cookingTime.cook;
  }
  next();
});

module.exports = mongoose.model('Recipe', recipeSchema);