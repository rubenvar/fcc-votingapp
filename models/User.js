const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        required: 'Please supply an email address'
    },
    name: {
        type: String,
        required: 'Please supply a name',
        trim: true
    },
    votes: [
        { type: mongoose.Schema.ObjectId, ref: 'Poll' }
    ]
});

// get the gravatar from gravatar.com (need to use the hashed email)
userSchema.virtual('gravatar').get(function() {
    const hash = md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=150`;
});

// creates the password field, and takes care of all the login details, adds methods, etc
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
// handle errors with not unique email registrations
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);