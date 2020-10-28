const mongoose = require('mongoose');

const User = mongoose.model('User');
const Poll = mongoose.model('Poll');
const { body, validationResult } = require('express-validator');

exports.checkVotedBefore = (req, res, next) => {
  let voted = false;
  const ip = req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(',')[0]
    : req.connection.remoteAddress;
  if (req.user) {
    voted = req.user.votes.some(
      vote => vote.toString() === res.locals.poll._id.toString()
    );
  }
  if (res.locals.poll.ips.indexOf(ip) > -1) {
    voted = true;
  }
  res.locals.voted = voted;
  next();
};

exports.checkVoted = async (req, res, next) => {
  const poll = await Poll.findOne({
    options: { $elemMatch: { _id: req.body.chosenId } },
  });
  let voted;
  const ip = req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(',')[0]
    : req.connection.remoteAddress;
  res.locals.ip = ip;

  if (req.user) {
    // check if logged in has the poll stored (already voted)
    voted = req.user.votes.some(vote => vote.toString() === req.body.pollId);
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
    await User.findByIdAndUpdate(
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
exports.validateRegister = [
  // first state the checks
  // body('name'); // check the name
  body('name', 'You must supply a name').notEmpty(),
  body('email', 'You must supply an email').notEmpty(),
  body('email', 'That Email is not valid').isEmail(),
  body('email').normalizeEmail({
    // normalize email, removing ., +, cases, etc.
    remove_dots: false,
    remove_exension: false,
    gmail_remove_subaddress: false,
  }),
  body('password', 'Password cannot be Blank!').notEmpty(),
  body('confirm-password', 'Confirmed Password cannot be Blank!').notEmpty(),
  body('confirm-password').custom((value, { req }) => {
    if (value !== req.body.password)
      throw new Error('Your passwords do not match');
    return value;
  }),
];

exports.throwRegisterError = (req, res, next) => {
  // call all the methods and get the errors if there are
  const errors = validationResult(req);

  // and manage the errors
  if (!errors.isEmpty()) {
    req.flash(
      'error',
      errors.array().map(err => err.msg)
    );
    res.render('register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash(),
    });
    return;
  }
  next();
};

exports.registerUser = async (req, res, next) => {
  // create the User and the register it:
  const user = new User({ email: req.body.email, name: req.body.name });
  // and await the register just created
  await User.register(user, req.body.password);
  next();
};

exports.findAccountUser = async (req, res, next) => {
  res.locals.accountUser = await User.find({ _id: req.params.id });
  next();
};
