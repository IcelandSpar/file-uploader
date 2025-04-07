

const getSignUpFormPage = (req, res) => {
  res.render('sign-up');
};

const getLogInFormPage = (req, res) => {
  res.render('log-in');
}

module.exports = {
  getSignUpFormPage,
  getLogInFormPage,
}