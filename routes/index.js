const express = require('express');
const pollController = require('../controllers/pollController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.get(
  '/',
  catchErrors(pollController.getPolls),
  pollController.renderHome
);

router.get('/new/poll', authController.isLoggedIn, pollController.addPoll);
router.post('/new/poll', catchErrors(pollController.createPoll));

router.get(
  '/polls',
  catchErrors(pollController.getPolls),
  pollController.renderPolls
);

router.get(
  '/polls/:slug',
  catchErrors(pollController.getPollBySlug),
  userController.checkVotedBefore,
  pollController.renderPoll
);
router.post(
  '/polls/:slug/vote',
  catchErrors(userController.checkVoted),
  catchErrors(pollController.countVote),
  catchErrors(userController.storePoll)
);
router.post(
  '/polls/:slug/new',
  catchErrors(pollController.getPollBySlug),
  catchErrors(pollController.addNewOption)
);

router.get('/login', userController.renderLogin);
router.post('/login', authController.login);

router.get('/register', userController.renderRegister);
router.post(
  '/register',
  userController.validateRegister, // validate the data
  userController.throwRegisterError, // throw errors
  catchErrors(userController.registerUser), // register the user
  authController.login // and log the user in
);

router.get('/logout', authController.logout);

router.get(
  '/user/:id',
  catchErrors(userController.findAccountUser),
  catchErrors(pollController.getPollsByAuthor)
);
router.post('/user/:id/delete', catchErrors(pollController.deletePoll));

module.exports = router;
