import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './temp/uploads');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); 
    const fileName = file.originalname.slice(0, 15);  
    cb(null, fileName + ext); 
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/gif',  
    'video/mp4', 'video/mpeg',               
    'application/pdf',                      
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, MP4, and MPEG files are allowed.'), false); 
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } 
});

export default upload;
