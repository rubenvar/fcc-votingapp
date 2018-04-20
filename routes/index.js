const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

// All the different routes
router.get('/', pollController.homepage);

router.get('/new/poll', authController.isLoggedIn, pollController.addPoll);
router.post('/new/poll', catchErrors(pollController.createPoll));

router.get('/polls', catchErrors(pollController.getPolls));

router.get('/polls/:slug', catchErrors(pollController.getPollBySlug));
router.post('/polls/:slug/vote', catchErrors(userController.checkVoted), catchErrors(pollController.countVote), catchErrors(userController.storePoll));

router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/register', userController.registerForm);
router.post('/register',
    userController.validateRegister, // validate the data
    catchErrors(userController.registerUser), // register the user
    authController.login // and log the user in
);

router.get('/logout', authController.logout);

router.get('/user/:id',
    // authController.checkLoggedIn,
    catchErrors(userController.findAccountUser),
    catchErrors(pollController.getPollsByAuthor)
); 
router.post('/user/:id/delete', catchErrors(pollController.deletePoll));

module.exports = router;