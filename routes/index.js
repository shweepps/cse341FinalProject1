const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use('/', require('./swagger'));

router.use('/recipes', require('./recipes'));
router.use('/users', require('./users'));

router.get('/login', passport.authenticate('github'), (res,req) => {});

router.get('/logout', function(req, res, next) {
    req.logout(function(err){
        if (err) { return next(err);}
        res.redirect('/');
    });
});

module.exports = router;
