require('dotenv').config();
const { isAuthenticated } = require('./formController');
const prisma = require('../db/client');
const supabase = require('../db/supabase-client');

const getUserHomePage = async (req, res) => {


  const isAuth = isAuthenticated(req.session.passport);

  const usersFolders = await prisma.folders.findMany({
    where: {
      userId: parseInt(req.params.id),
    },
    orderBy: {
      id: 'asc'
    }
  })

  


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





  res.redirect(`/folders/${req.params.id}/${req.params.user}`);
}

const getDownloadFile = (req, res) => {
  


  res.download(`./uploads/${req.params.fileName}`, (err) => {
    if(err) res.status(404).json({error: 'File not found'});
  });
}

const getFolderPage = async (req, res) => {
  const isAuth = isAuthenticated(req.session.passport);

  if(isAuth && req.session.passport.user == req.params.id && req.user.username == req.params.user) {
    const folderInfo = await prisma.folders.findFirst({
      where: {
        folderName: req.params.folderName,
        userId: req.session.passport.user,
      },
  
    });
    
    const files = await prisma.files.findMany({
      where: {
        folderId: folderInfo.id,
      },
      include: {
        folder: true,
      },
  
    })
  
    res.render('folder', {
      postAction: `/folders/${req.params.id}/${req.params.user}/${req.params.folderName}`,
      files: files,
    })
  } else {
    res.end('Not Authorized')
  }


}

const postFile = async (req, res) => {

console.log(req.file)
  const { data, error } = await supabase
  .storage
  .from('file-uploader-app-files')
  .upload(req.file.path, req.file.buffer, {
    cacheControl: '3600',
    contentType: req.file.mimetype,
  })
  console.log(error)


  const folderInfo = await prisma.folders.findFirst({
    where: {
      folderName: req.params.folderName,
      userId: req.session.passport.user,
    },
    select: {
      id: true,
    }
  });


  await prisma.files.create({
    data: {
      folderId: folderInfo.id,
      userId: parseInt(req.params.id),
      originalName: req.file.originalname,
      encoding: req.file.encoding,
      mimetype: req.file.mimetype,
      destination: req.file.destination,
      fileName: req.file.filename,
      path: req.file.path,
      size: req.file.size,
    }
  })
  // obj returned: original name, encoding, mimetype, destination, filename, path, size
  res.redirect(`/folders/${req.params.id}/${req.params.user}/${req.params.folderName}`)
}


// model Files {
//   id           Int     @id @default(autoincrement())
//   folder       Folders @relation(fields: [folderId], references: [id])
//   folderId     Int
//   user         Users   @relation(fields: [userId], references: [id])
//   userId       Int
//   originalName String  @db.VarChar(255)
//   encoding     String  @db.VarChar(255)
//   mimetype     String  @db.VarChar(255)
//   destination  String  @db.VarChar(255)
//   fileName     String  @db.VarChar(255)
//   path         String  @db.VarChar(255)
//   size         Int
// }



module.exports = {
  getUserHomePage,
  postNewFolder,
  getDownloadFile,
  getFolderPage,
  postFile,
}