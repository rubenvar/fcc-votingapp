const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise; // it's there to suppress the error even if it's added in start.js already

const slug = require('slugs');

const pollSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Supply a name for this poll'
    },
    slug: String,
    created: {
        type: Date,
        default: Date.now
    },
    options: [
        {
            option: {
                type: String,
                required: 'Supply the option'
            },
            votes: Number
        }
    ],
    total: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author'
    },
    ips: [{
        type: String
    }]
});

// create the slug before saving
pollSchema.pre('save', async function(next) {
    // stop if the name doesn't change
    if (!this.isModified('name')) {
        return next();
    }
    this.slug = slug(this.name);

    // find other stores with the same name:
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i'); // find if it already has a last '-#''
    const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
    if (storesWithSlug.length) {
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }

    next();
});

module.exports = mongoose.model('Poll', pollSchema);