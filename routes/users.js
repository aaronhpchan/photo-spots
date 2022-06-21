const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utilities/wrapAsync');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
});
router.post('/register', wrapAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, e => {
            if (e) return next (e);
            req.flash('success', 'Thank you for registering!');
            res.redirect('/spots');
        });       
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/spots';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
    req.logout(e => {
        if (e) return next(e);
        req.flash('success', 'You have successfully logged out.');
        res.redirect('/spots');
    });   
});

module.exports = router;