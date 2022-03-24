const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const usersController = require('../controllers/users');
const {validateFeedback, isModerator} = require('../middleware');

router.get('/register',usersController.renderRegister);

router.post('/register', catchAsync( usersController.register));

router.get('/login', usersController.renderLogin);
//passport authenticate user using local strategy
router.post('/login',
 passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
 usersController.login)

router.get('/logout', usersController.logout);

router.get('/writeus', usersController.writeUsForm);
router.post('/writeUs', validateFeedback, catchAsync(usersController.createFeedback))
router.get('/writeus/:id/useful', isModerator, catchAsync(usersController.feedbackUseful));
router.get('/writeus/:id/old', isModerator,catchAsync( usersController.feedbackOld));

router.post('/news',  catchAsync(usersController.createNews))

module.exports = router;