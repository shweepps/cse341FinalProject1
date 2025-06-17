const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorites');
const ensreAuth = require('../middleware/authMiddleware');

router.get('/', favoriteController.getAll);
router.get('/:id', favoriteController.getSingle);

router.post('/', ensreAuth, favoriteController.createFavorite);
router.delete('/:id', ensreAuth, favoriteController.deleteFavorite);

module.exports = router;
