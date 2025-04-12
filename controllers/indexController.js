const { isAuthenticated } = require("./formController");
const prisma = require('../db/client');


const getIndexPage = async (req, res) => {
  if(req.session.passport) {
    const loggedInUser = await prisma.users.findFirst({
      where: {
        id: req.session.passport.user,
      }
    });
  
    console.log(req.session.passport.user)
    
    res.render('index', {
      isAuth: isAuthenticated(req.session.passport),
      loggedInUserId: req.session.passport.user,
      loggedInUsername: loggedInUser.username,
    })
  } else {
    res.render('index', {
      isAuth: isAuthenticated(req.session.passport),
    })
  }

};



module.exports = {
  getIndexPage,
}