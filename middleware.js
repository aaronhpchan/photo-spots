module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {      
        req.session.returnTo = req.originalUrl; //store the original url the user is requesting
        req.flash('error', 'You must be logged in to access this feature');
        return res.redirect('/login');
    }
    next();
}