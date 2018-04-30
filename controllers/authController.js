const passport = require('passport');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Failed Login!',
    successRedirect: '/',
    successFlash: 'You are now logged in!'
}); // created a passport.js in handler to manage the local strategy

exports.logout = (req, res) => {
    req.logout();
    req.flash('info', 'You are now logged out! 👋');
    res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
    // check if user is authenticated
    if (req.isAuthenticated()) {
        next();
        return;
    }
    req.flash('error', 'You must be logged in');
    res.redirect('/login');
};