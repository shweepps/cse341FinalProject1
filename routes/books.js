const express = require('express');
const router = express.Router();
const bookController =  require('../controllers/books');
const ensreAuth = require('../middleware/authMiddleware');

router.get('/', bookController.getAll);
router.get('/:id', bookController.getSingle);

router.post('/', ensreAuth, bookController.createBook);
router.put('/:id', ensreAuth,  bookController.updateBook);
router.delete('/:id', ensreAuth, bookController.deleteBook);

module.exports = router;