require('dotenv').config();
const { isAuthenticated } = require('./formController');
const prisma = require('../db/client');
const supabase = require('../db/supabase-client');
const { decode } = require('base64-arraybuffer');
const fs = require('fs');
const prettyBytes = (...args) => import('pretty-bytes').then(({default: prettyBytes}) => prettyBytes(...args));
const  { format } = require("date-fns");



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



    let formattedUsersFolders = usersFolders.map((folder, index) => {

      return {
        ...folder,
        formattedDates: {
          createDateTime: [format(usersFolders[index].created, 'MMM dd yyy'), format(usersFolders[index].created, 'p')],
          modifiedDateTime: [format(usersFolders[index].modified, 'MMM dd yyy'), format(usersFolders[index].modified, 'p')],
        }
      }
    });


  if(isAuth && req.session.passport.user == req.params.id && req.user.username == req.params.user) {
    res.render('user-home', {
      usersFolders: formattedUsersFolders,
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

const getDownloadFile = async (req, res) => {
  
  const isAuth = isAuthenticated(req.session.passport);

  const user = await prisma.users.findFirst({
    where: {
      id: req.user.id,
    }
  });



  const fileData = await prisma.files.findFirst({
    where: {
      id: parseInt(req.params.fileId)
    },
    include: {
      folder: true,
    }
  });



const formattedSize = await prettyBytes(fileData.size);



  const { data } = await supabase
  .storage
  .from('file-uploader-app-files')
  .createSignedUrl(`uploads/${req.params.fileName}`, 60, {
    download: true,
    loggedInUserId: parseInt(req.user.id),
    loggedInUsername: req.user.username,
  });
  
if(isAuth) {
  res.render('file', {
    downloadUrl: data.signedUrl,
    fileData,
    formattedSize,
    isAuth,
    loggedInUserId: user.id,
    loggedInUsername: user.username,
    folderViewLink: `/folders/${user.id}/${user.username}/${fileData.folder.folderName}`,
  })
} else {
  res.end('Not Authorized');
}



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
      isAuth,
      folderInfo,
    })
  } else {
    res.end('Not Authorized')
  }


}

const postFile = async (req, res) => {

    const file = req.file;
    if(!file) {
      res.status(400).json({message: "Please upload a file"});
      return;
    }

    const fileBase64 = decode(file.buffer.toString("base64"));


  const { data, error } = await supabase
  .storage
  .from('file-uploader-app-files')
  .upload(`uploads/${file.originalname}`, fileBase64, {
    contentType: req.file.mimetype,
  })

  async function getPubUrl(fileOriginalName) {
    const { data } = supabase
    .storage
    .from('file-uploader-app-files')
    .getPublicUrl(`uploads/${fileOriginalName}`)

    return data
  }

  const fileUrlData = await getPubUrl(file.originalname);


  const folderInfo = await prisma.folders.findFirst({
    where: {
      folderName: req.params.folderName,
      userId: req.session.passport.user,
    },
    select: {
      id: true,
    }
  });


  const created = await prisma.files.create({
    data: {
      folderId: folderInfo.id,
      userId: parseInt(req.params.id),
      originalName: req.file.originalname,
      encoding: req.file.encoding,
      mimetype: req.file.mimetype,
      destination: `uploads/`,
      fileName: req.file.originalname,
      fileUrl: fileUrlData.publicUrl,
      path: `uploads/${file.originalname}`,
      size: req.file.size,
    }
  })

 res.redirect(`/folders/${req.params.id}/${req.params.user}/${req.params.folderName}`)

}


module.exports = {
  getUserHomePage,
  postNewFolder,
  getDownloadFile,
  getFolderPage,
  postFile,
}