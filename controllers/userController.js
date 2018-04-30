const mongoose = require('mongoose');
const User = mongoose.model('User');
const Poll = mongoose.model('Poll');
const promisify = require('es6-promisify');

exports.checkVotedBefore = (req, res, next) => {
    let voted = false;
    const ip = req.headers['x-forwarded-for'].split(',')[0] || req.connection.remoteAddress;
    if (req.user) {
        voted = req.user.votes.some(vote => {
            return vote.toString() === res.locals.poll._id.toString();
        });
    }
    if (res.locals.poll.ips.indexOf(ip) > -1) {
        voted = true;
    }
    res.locals.voted = voted;
    next();
};

exports.checkVoted = async (req, res, next) => {
    const poll = await Poll.findOne({ options: { $elemMatch: { _id: req.body.chosenId } } });
    let voted;
    const ip = req.headers['x-forwarded-for'].split(',')[0] || req.connection.remoteAddress;
    res.locals.ip = ip;

    if (req.user) {
        // check if logged in has the poll stored (already voted)
        voted = req.user.votes.some((vote) => {
            return vote.toString() === req.body.pollId;
        });
    }
    if (poll.ips.indexOf(ip) > -1) {
        voted = true;
    }
    // if user voted, return, else keep going to count the vote and store it
    if (voted) {
        // TODO need to flash that already voted
        req.flash('error', 'You already voted on this poll before...');
        res.json(poll);
    } else {
        next();
    }
};

exports.storePoll = async (req, res) => {
    if (req.user) {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { votes: req.body.pollId } },
            { new: true }
        );
    }
};

exports.renderLogin = (req, res) => {
    res.render('login', { title: 'Login' });
};

exports.renderRegister = (req, res) => {
    res.render('register', { title: 'Register' });
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