const express = require('express');
const router = express.Router();

// In-memory JSON data
let recipes = [
  { id: 1, name: 'Spaghetti Bolognese', ingredients: ['spaghetti', 'meat', 'tomato sauce'] },
];

// ✅ Existing CRUD

// Get all recipes
router.get('/', (req, res) => {
  res.json(recipes);
});

// Get recipe by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const recipe = recipes.find(r => r.id === id);
  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404).json({ error: 'Recipe not found' });
  }
});

// Add a new recipe
router.post('/', (req, res) => {
  const newRecipe = req.body;
  newRecipe.id = recipes.length ? recipes[recipes.length - 1].id + 1 : 1;
  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
});


// ✅ NEW: Generate recipe dynamically based on user input
router.post('/generate', (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients) {
    return res.status(400).json({ error: 'Ingredients are required' });
  }

  const recipe = {
    title: `Recipe with ${ingredients}`,
    ingredients: ingredients.split(',').map(item => item.trim()),
    instructions: `Here’s how you can cook something tasty with ${ingredients}:
      1. Prepare the ingredients.
      2. Cook them together.
      3. Serve hot.`,
    time: '20–40 mins',
    diet: 'Depends on ingredients'
  };

  res.json(recipe);
});

module.exports = router;
