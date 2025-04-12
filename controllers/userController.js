const { isAuthenticated } = require('./formController');
const prisma = require('../db/client');

const getUserHomePage = async (req, res) => {

  // console.log(req.user)
  const isAuth = isAuthenticated(req.session.passport);

  const usersFolders = await prisma.folders.findMany({
    where: {
      userId: parseInt(req.params.id),
    }
  })

  

  console.log(usersFolders)

  if(isAuth && req.session.passport.user == req.params.id && req.user.username == req.params.user) {
    res.render('user-home', {
      usersFolders,
      loggedInUserId: req.params.id,
      loggedInUsername: req.params.user,
      isAuth,
    });
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



  res.redirect(`/folders/${req.params.id}/${req.params.user}`);
}

const getDownloadFile = (req, res) => {
  
console.log(req.params.fileName)

  res.download(`./uploads/${req.params.fileName}`, (err) => {
    if(err) res.status(404).json({error: 'File not found'});
  });
}






module.exports = {
  getUserHomePage,
  postNewFolder,
  getDownloadFile,
}