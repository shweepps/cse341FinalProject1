const express = require('express');
const router = express.Router();
const userController = require('../controllers/users'); // adjust path if needed
const ensureAuth = require('../middleware/authMiddleware')


router.get('/', userController.getAll);
router.get('/:id', userController.getSingle);

router.post('/', ensureAuth, userController.createUser);
router.put('/:id',ensureAuth, userController.updateUser);
router.delete('/:id', ensureAuth, userController.deleteUser);

module.exports = router;
