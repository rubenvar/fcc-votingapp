require('dotenv').config();
const mongoose = require('mongoose');

// connect to db and handle bad connections
exports.clientP = mongoose.connect(process.env.DATABASE, {
  // useCreateIndex: true,
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useFindAndModify: false,
}).then(m => {
  console.log('Connected to DB 👍');
  return m.connection.getClient();
}).catch(
  err => {
    console.log('Error connecting to DB 🙅‍♀️', err);
    process.exit(1);
  }
);

mongoose.connection.on('error', err => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// import models
require('./models/Poll');
require('./models/User');

// Start!
const app = require('./app');

app.set('port', process.env.PORT || 7799);
const server = app.listen(app.get('port'), () => {
  console.log(
    `🚀🚀 Express running → http://localhost:${server.address().port}`
  );
});
