const { isAuthenticated } = require('./formController');
const prisma = require('../db/client');

const getUserHomePage = async (req, res) => {


  const usersFolders = await prisma.users.findMany({
    include: {
      Folders: true,
    }
  })

  

  console.log(usersFolders[0].Folders)

  if(isAuthenticated(req.session.passport)) {
    res.render('user-home');
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


  res.end();
}






module.exports = {
  getUserHomePage,
  postNewFolder,
}