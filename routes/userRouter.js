const { Router } = require('express');
const userRouter = Router();
const { getUserHomePage, postNewFolder } = require('../controllers/userController.js');


userRouter.get('/:id/:user', getUserHomePage);
userRouter.post('/:id/:user', postNewFolder);


module.exports = userRouter;