const prisma = require('../db/client');


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
    const createdUsersTest = await prisma.users.create({
      data: {
        username: req.body.username,
        hash: req.body.password,
        salt: 'random salt',
      }
    });
    console.log(createdUsersTest);
    res.redirect('/form/sign-up');
  } catch(err) {
    return next(err);
  }

};

const getLogInFormPage = async (req, res) => {
  const session = await prisma.session.findMany();

  res.render('log-in');
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
res.render('index', {
  isAuth: isAuthenticated(req.session.passport),
})
}

module.exports = {
  getSignUpFormPage,
  postSignUpForm,
  getLogInFormPage,
  postLogInForm,
  getLogOut,
}