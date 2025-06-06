
const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));
router.get('/', (req, res) => {res.send('Welcome!, Have fun with Books')});

router.use('/books', require('./books'))
module.exports = router;