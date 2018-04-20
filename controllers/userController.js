const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

exports.registerForm = (req, res, next) => {
    res.render('register', { title: 'Register' });
    next();
};
// sanitizing with expressValidator: 
exports.validateRegister = (req, res, next) => {
    // first state the checks
    req.sanitizeBody('name'); // check the name
    req.checkBody('name', 'You must supply a name').notEmpty(); // check that name is supplied
    req.checkBody('email', 'That Email is not valid').isEmail(); // check that email is correct
    req.sanitizeBody('email').normalizeEmail({ // normalize email, removing ., +, cases, etc.
        remove_dots: false,
        remove_exension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password cannot be Blank!').notEmpty(); // check that there is a password
    req.checkBody('confirm-password', 'Confirmed Password cannot be Blank!').notEmpty(); // check that there is a confirm password
    req.checkBody('confirm-password', 'Oops! Your passwords do not match').equals(req.body.password); // check that both passwords are equal

    // call all the methods and get the errors if there are
    const errors = req.validationErrors();

    // and manage the errors
    if (errors) {
        req.flash('error', errors.map(err => err.msg));
        res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
        return;
    }
    next();
};

exports.registerUser = async (req, res, next) => {
    // create the User and the register it:
    const user = new User({ email: req.body.email, name: req.body.name });
    // the passport "register" method doesn't have promises, so promisify it and we can use async/await
    const register = promisify(User.register, User);
    // and await the register just created
    await register(user, req.body.password);
    next();
};

exports.findAccountUser = async (req, res, next) => {
    res.locals.accountUser = await User.find({ _id: req.params.id });
    next();
};

exports.checkVoted = async (req, res, next) => {
    if (!req.user) {return next();}
    let isVoted = req.user.votes.some((vote) => {
        return vote.toString() === req.body.pollId;
    });

    if (isVoted) {
        // TODO need to flash that already voted
        console.log('user already voted!');
        return;
    } else {
        console.log('different');
        next();
    }
};

exports.storePoll = async (req, res) => {
    console.log('works only if logged in');
    if (req.user) {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { votes: req.body.pollId } },
            { new: true }
        );
    }
};