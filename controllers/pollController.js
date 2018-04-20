const mongoose = require('mongoose');
const Poll = mongoose.model('Poll');

exports.homepage = (req, res) => {
    // res.redirect('/polls');
    res.render('home', { title: '4Poll' });
};

exports.addPoll = (req, res) => {
    res.render('createPoll', { title: 'Add Poll' });
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

exports.getPolls = async (req, res) => {
    // query db for all polls
    const polls = await Poll.find().populate('author');
    res.render('polls', { title: 'All the Polls', polls });
};

exports.getPollBySlug = async (req, res, next) => {
    const poll = await Poll.findOne({ slug: req.params.slug }).populate('author');
    if (!poll) {
        next();
        return;
    }
    res.render('poll', { poll, title: poll.name });
};

exports.countVote = async (req, res, next) => {
    const find = { options: { $elemMatch: { _id: req.body.chosenId } } };
    const update = { $inc: { total: 1, "options.$.votes": 1 } };
    const options = { new: true, runValidators: true };
    const result = await Poll.findOneAndUpdate(find, update, options).exec();
    console.log('voto añadido');
    // TODO need to flash that vote is counted
    // should add the poll _id to the users db
    res.json(result);
    next();
};

exports.getPollsByAuthor = async (req, res) => {
    const slugId = req.params.id;
    const polls = await Poll.find({ author: req.params.id }).populate('author');
    res.render('user', { title: res.locals.accountUser[0].name, polls, slugId });
};

exports.deletePoll = async (req, res) => {
    // delete the poll
    const pollToDelete = await Poll.find({ _id: req.body.pollIdToDelete }).remove().exec();
    console.log('deleted this poll ' + req.body.pollIdToDelete + '!');
    res.json(pollToDelete);
}