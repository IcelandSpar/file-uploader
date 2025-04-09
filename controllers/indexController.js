const { isAuthenticated } = require("./formController");


const getIndexPage = async (req, res) => {
  // const users = await prisma.users.findMany();
  // console.log(users);
  res.render('index', {
    isAuth: isAuthenticated(req.session.passport)
  })
};



module.exports = {
  getIndexPage,
}