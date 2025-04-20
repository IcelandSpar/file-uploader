const { Router } = require('express');
const userRouter = Router();
const { getUserHomePage, postNewFolder, getDownloadFile, getFolderPage, postFile } = require('../controllers/userController.js');


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
// const upload = multer({dest: 'uploads/'});

userRouter.get('/download/:fileName', getDownloadFile)
userRouter.get('/folders/:id/:user', getUserHomePage);
userRouter.post('/folders/:id/:user', postNewFolder);

userRouter.get('/folders/:id/:user/:folderName', getFolderPage);
userRouter.post('/folders/:id/:user/:folderName', upload.single('uploadedFile'), postFile);





module.exports = userRouter;