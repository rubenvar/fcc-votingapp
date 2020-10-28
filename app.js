const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');
require('./handlers/passport'); // specify the strategy for passport

// create our Express app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// sanything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Exposes a bunch of methods for validating data. Used heavily on userController.validateRegister
// app.use(expressValidator());

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());

// Sessions: store data on visitors from req to req: keeps users logged in + allows flash messages
app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 24 * 1000,
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

// Passport JS to handle logins
app.use(passport.initialize());
app.use(passport.session());

// flash middleware: use req.flash('error', 'Shit!'), will pass that message to the next page
app.use(flash());

// pass variables to templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers; // some misc helper functions
  res.locals.flashes = req.flash(); // the flash messages
  res.locals.user = req.user || null; // the user data if they are authenticated
  res.locals.currentPath = req.path; // the path
  next();
});

// After allllll that above middleware, handle routes!
app.use('/', routes);

// If that above routes didnt work, 404 + forward to error handler
app.use(errorHandlers.notFound);

// validation errors
app.use(errorHandlers.flashValidationErrors);

// really bad error
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// done! export it to start.js
module.exports = app;
