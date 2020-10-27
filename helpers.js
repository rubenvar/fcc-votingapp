const { formatDistanceToNow } = require('date-fns');

// date-fns, for displaying things like "Posted 5 minutes ago" in the templates
exports.toNow = formatDistanceToNow;

// handy debugging function
exports.dump = obj => JSON.stringify(obj, null, 2);

// details about the site
exports.siteName = `voted, a Voting App for freeCodeCamp`;

exports.menu = [
  { slug: '/polls', title: '📊 Polls' },
  { slug: '/new/poll', title: '✍️  Add new' },
];
