const { Router } = require('express');
const { getSignUpFormPage, getLogInFormPage } = require('../controllers/formController');
const formRouter = Router();


formRouter.get('/sign-up', getSignUpFormPage);

formRouter.get('/log-in', getLogInFormPage);



module.exports = formRouter;
