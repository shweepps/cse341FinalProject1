const express = require('express');
const router = express.Router();
const recipeController =  require('../controllers/recipes');
const ensreAuth = require('../middleware/authMiddleware');

router.get('/', recipeController.getAll);
router.get('/:id', recipeController.getSingle);

router.post('/', ensreAuth, recipeController.createRecipe);
router.put('/:id', ensreAuth, recipeController.updateRecipe);
router.delete('/:id', ensreAuth, recipeController.deleteRecipe);

module.exports = router