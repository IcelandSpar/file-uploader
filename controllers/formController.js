const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

const getLogInFormPage = (req, res) => {
  res.render('log-in');
}

module.exports = {
  getSignUpFormPage,
  postSignUpForm,
  getLogInFormPage,
}