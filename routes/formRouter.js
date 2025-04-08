const { Router } = require('express');
const { getSignUpFormPage, getLogInFormPage, postSignUpForm, getLogOut, postLogInForm } = require('../controllers/formController');
const formRouter = Router();
const passport = require('passport');

formRouter.get('/sign-up', getSignUpFormPage);
formRouter.post('/sign-up', postSignUpForm);

formRouter.get('/log-in', getLogInFormPage);
formRouter.post('/log-in', passport.authenticate('local'), postLogInForm);

formRouter.get('/log-out', getLogOut);



module.exports = formRouter;
