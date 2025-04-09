const prisma = require('../db/client');
const bcrypt = require('bcryptjs');


const isAuthenticated = (userObj) => {
  return !!userObj
};

const getSignUpFormPage = async (req, res) => {
  const usersDbTest = await prisma.users.findMany({

  });

  console.log(usersDbTest);

  res.render('sign-up');
};

const postSignUpForm = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    
    const createdUsersTest = await prisma.users.create({
      data: {
        username: req.body.username,
        hash: hashedPass,
        salt: salt,
      }
    });
    res.redirect('/form/sign-up');
  } catch(err) {
    return next(err);
  }

};

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

const postLogInForm = (req, res) => {

  res.redirect(`/${req.user.id}/${req.user.username}`)
  // isAuth: isAuthenticated(req.session.passport),
}

const getUploadFormPage = (req, res) => {
  res.render('upload-form');
}

const postUploadForm = (req, res) => {
  console.log(req.file)
  res.redirect('/form/upload');
}

module.exports = {
  getSignUpFormPage,
  postSignUpForm,
  getLogInFormPage,
  postLogInForm,
  getLogOut,
  getUploadFormPage,
  postUploadForm,
  isAuthenticated
}