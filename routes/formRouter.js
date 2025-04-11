const { Router } = require('express');
const { getSignUpFormPage, getLogInFormPage, postSignUpForm, getLogOut, postLogInForm, getUploadFormPage, postUploadForm, validateUser } = require('../controllers/formController');
const formRouter = Router();
const passport = require('passport');

const multer = require('multer');
const upload = multer({dest: 'uploads/'});

formRouter.get('/sign-up', getSignUpFormPage);
formRouter.post('/sign-up', postSignUpForm);

formRouter.get('/log-in', getLogInFormPage);
formRouter.post('/log-in', postLogInForm );

formRouter.get('/log-out', getLogOut);

formRouter.get('/upload', getUploadFormPage);
formRouter.post('/upload', upload.single('uploadedFile'), postUploadForm);




module.exports = formRouter;
