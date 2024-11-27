import multer from "multer";encodeURI

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './temp/analysis');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); 
        const fileName = file.originalname.slice(0, 15); 
        cb(null, fileName + ext); 
    }
  })
  
  const ImageAnalysis = multer({ storage: storage })

  export default {ImageAnalysis};