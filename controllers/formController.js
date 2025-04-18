const prisma = require('../db/client');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const { unlink } = require('node:fs');


const validateUser = [
body('username').trim()
.isLength({min: 4, max: 30}).withMessage('Username must be between 4-30 characters.')
.isAlphanumeric().withMessage('Username must be an alphanumeric value.'),
body('password').trim()
.isLength({min: 4, max: 30}).withMessage('Password must be between 4-30 characters.')
.isAlphanumeric().withMessage('Password must be an alphanumeric value.')

];

const isAuthenticated = (userObj) => {
  return !!userObj
};

const getSignUpFormPage = async (req, res) => {
  const usersDbTest = await prisma.users.findMany({

  });

  // console.log(usersDbTest);

  res.render('sign-up');
};

const postSignUpForm = [
  validateUser,
  async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).render('sign-up', {errors: errors.array()})
    }



    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, 10);

    const checkIfUsernameTaken = await prisma.users.findFirst({
      where: {
        username: req.body.username
      }
    });

    if(!!checkIfUsernameTaken) {
      return res.render('sign-up', {
        userTakenMsg: 'Username is already taken. Please use a different username.'
      });
    }
    
    const createdUsersTest = await prisma.users.create({
      data: {
        username: req.body.username,
        hash: hashedPass,
        salt: salt,
      }
    });
    res.redirect('/form/log-in');
  } catch(err) {
    return next(err);
  }

}];

const getLogInFormPage = async (req, res) => {
  const session = await prisma.session.findMany();
  if(!!req.session.passport == false) {
    res.render('log-in', {failureMessage: req.session.messages});
    req.session.messages = undefined;
  } else {
    res.render('log-in');
  }

    

  
}

const getLogOut = (req, res, next) => {
  req.logout((err) => {
    if(err) {
      return next(err);
    }
    res.redirect('/');
  })
}

const postLogInForm = [
  validateUser,
  (req, res) => {

  const errors = validationResult(req);


  if(!errors.isEmpty()) {
  return res.status(400).render('log-in', {errors: errors.array()})

  } else {
    passport.authenticate('local', {failureRedirect: '/form/log-in', successRedirect: '/', failureMessage: true})(req, res)

  }
  


  // res.redirect(`/${req.user.id}/${req.user.username}`)
  // isAuth: isAuthenticated(req.session.passport),
}]

const getUploadFormPage = (req, res) => {
  res.render('upload-form');
}

const postUploadForm = (req, res) => {
  // console.log(req.file)
  res.redirect('/form/upload');
}

const postEditFolderForm = async (req, res) => {

  await prisma.folders.update({
    where: {
      id: parseInt(req.params.folderId),
    },
    data: {
      folderName: req.body.editFolderName,
         description: req.body.editFolderDescription,
    }
  });
  res.redirect(`/folders/${req.user.id}/${req.user.username}`);
}

const postDeleteFolderForm = async (req, res) => {

  const filesToBeDeleted = await prisma.files.findMany({
    where: {
      folderId: parseInt(req.body.folderId),
      userId: req.session.passport.user,
    }
  });

  const deletedFolder = await prisma.folders.delete({
    where: {
      id: parseInt(req.body.folderId),
      userId: req.session.passport.user,
    }
  });


  filesToBeDeleted.forEach((file) => {
    unlink(file.path, (err) => {
      if(err) throw err;
    })
    console.log(`${file.path} was deleted.`);
  })

  res.redirect(`/folders/${req.user.id}/${req.user.username}`);
};

const postDeleteFile = async (req, res) => {
  
  const fileFolderOrigin = await prisma.files.findFirst({
    where: {
      userId: req.session.passport.user,
      id: parseInt(req.params.fileId),
      
    },
    include: {
      folder: true,
    }
  });

  const deletedFile = await prisma.files.delete({
    where: {
      userId: req.session.passport.user,
      id: parseInt(req.params.fileId),
    }
  });

  unlink(fileFolderOrigin.path, (err) => {
    if(err) throw err;
    console.log(`${fileFolderOrigin.path} was deleted.`);
  })



  res.redirect(`/folders/${req.user.id}/${req.user.username}/${fileFolderOrigin.folder.folderName}`);
};

const getCheckIfUserWillDelete = async (req, res) => {
  console.log(req.params.fileId)
  const fileToBeDeleted = await prisma.files.findFirst({
    where: {
      id: parseInt(req.params.fileId),
    }
  });
  console.log(fileToBeDeleted)

  res.render('verify-delete-file', {
    file: fileToBeDeleted,
  })
}



module.exports = {
  getSignUpFormPage,
  postSignUpForm,
  getLogInFormPage,
  postLogInForm,
  getLogOut,
  getUploadFormPage,
  postUploadForm,
  isAuthenticated,
  postEditFolderForm,
  postDeleteFolderForm,
  postDeleteFile,
  getCheckIfUserWillDelete,
}