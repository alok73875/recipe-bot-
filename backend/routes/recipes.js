const express = require('express');
const router = express.Router();

// In-memory JSON data
let recipes = [
  { id: 1, name: 'Spaghetti Bolognese', ingredients: ['spaghetti', 'meat', 'tomato sauce'] },
];

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

module.exports = router;