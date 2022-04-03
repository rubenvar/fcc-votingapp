const session = require('express-session');
const MongoStore = require('connect-mongo');
const { clientP } = require('../start');

module.exports = session({
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
  store: MongoStore.create({ clientPromise: clientP }),
})