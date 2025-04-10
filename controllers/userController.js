const { isAuthenticated } = require('./formController');
const prisma = require('../db/client');

const getUserHomePage = async (req, res) => {

  console.log(req.user)

  const usersFolders = await prisma.folders.findMany({
    where: {
      userId: parseInt(req.params.id),
    }
  })

  

  console.log(usersFolders)

  if(isAuthenticated(req.session.passport) && req.session.passport.user == req.params.id && req.user.username == req.params.user) {
    res.render('user-home', {usersFolders: usersFolders,});
  } else {
    res.end('Not Authorized')
  }
  
}

const postNewFolder = async (req, res) => {
  const createdFolder = await prisma.folders.create({
    data: {
      userId: parseInt(req.params.id),
      folderName: req.body.folderName,
      description: req.body.folderDescription,
    }
  })

  console.log(createdFolder);



  res.redirect(`/${req.params.id}/${req.params.user}`);
}






module.exports = {
  getUserHomePage,
  postNewFolder,
}