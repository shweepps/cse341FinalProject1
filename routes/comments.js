const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comments');
const ensreAuth = require('../middleware/authMiddleware');

router.get('/', commentController.getAll);
router.get('/:id', commentController.getSingle);

router.post('/', ensreAuth, commentController.createComment);
router.put('/:id', ensreAuth, commentController.updateComment);
router.delete('/:id', ensreAuth, commentController.deleteComment);

module.exports = router;
