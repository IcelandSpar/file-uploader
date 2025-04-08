const { Router } = require('express');
const { getSignUpFormPage, getLogInFormPage, postSignUpForm } = require('../controllers/formController');
const formRouter = Router();

formRouter.get('/sign-up', getSignUpFormPage);
formRouter.post('/sign-up', postSignUpForm);

formRouter.get('/log-in', getLogInFormPage);



module.exports = formRouter;
