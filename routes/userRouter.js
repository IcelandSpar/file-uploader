const { Router } = require('express');
const userRouter = Router();
const { getUserHomePage, postNewFolder, getDownloadFile } = require('../controllers/userController.js');


userRouter.get('/download/:fileName', getDownloadFile)
userRouter.get('/folders/:id/:user', getUserHomePage);
userRouter.post('/folders/:id/:user', postNewFolder);





module.exports = userRouter;