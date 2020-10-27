const mongoose = require('mongoose');
const Poll = mongoose.model('Poll');

exports.getPolls = async (req, res, next) => {
    // query db for all polls
    const polls = await Poll.find().sort({ created: -1 }).populate('author');
    res.locals.polls = polls;
    next();
};

exports.renderHome = (req, res) => {
    const polls = res.locals.polls;
    res.render('home', { title: 'The voted app', polls });
};

exports.addPoll = (req, res) => {
    res.render('createPoll', { title: 'Add New Poll' });
};

exports.createPoll = async (req, res) => {
    // add the author (the user id) after creating users
    req.body.author = req.user._id;
    // add 0 votes to each option
    req.body['options'].forEach(opt => {
        opt['votes'] = 0;
    });
    const poll = await (new Poll(req.body)).save();
    req.flash('success', `You successfully created <strong>${poll.name}</strong>. Share it with your friends!`);
    res.redirect(`/polls/${poll.slug}`);
};

exports.renderPolls = (req, res) => {
    const polls = res.locals.polls;
    res.render('polls', { title: 'All the Polls', polls });
}

exports.getPollBySlug = async (req, res, next) => {
    const poll = await Poll.findOne({ slug: req.params.slug }).populate('author');
    if (!poll) {
        return next();
    }
    res.locals.poll = poll;
    next();
};

exports.renderPoll = (req, res) => {
    const poll = res.locals.poll;
    const voted = res.locals.voted;
    const ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.connection.remoteAddress;
    
    const labels = [], data = [];
    poll.options.forEach(opt=> {
        labels.push(opt.option);
        data.push(opt.votes);
    });

    res.render('poll', { title: poll.name, poll, voted, ip, labels, data });
};

exports.countVote = async (req, res, next) => {
    const ip = res.locals.ip;
    const find = { options: { $elemMatch: { _id: req.body.chosenId } } };
    const update = {
        // add one to totals and to the option vote
        $inc: { total: 1, "options.$.votes": 1 },
        // and store the user's ip
        $push: { ips: ip }
    };
    const options = { new: true, runValidators: true };
    const result = await Poll.findOneAndUpdate(find, update, options).exec();
    res.json(result);
    next();
};

exports.addNewOption = async (req, res) => {
    const poll = res.locals.poll;
    const option = req.body.newOption;
    const obj = {
        option,
        votes: 0
    };
    const updatedPoll = await Poll.findOneAndUpdate(
        { _id: poll._id },
        { $push: { options: obj } },
        { new: true, runValidators: true }
    );
    res.redirect('back');
};

exports.getPollsByAuthor = async (req, res) => {
    const slugId = req.params.id;
    const polls = await Poll.find({ author: req.params.id }).populate('author');
    res.render('user', { title: res.locals.accountUser[0].name, polls, slugId });
};

exports.deletePoll = async (req, res) => {
    // delete the poll
    const pollToDelete = await Poll.find({ _id: req.body.pollIdToDelete }).remove().exec();
    res.json(pollToDelete);
};