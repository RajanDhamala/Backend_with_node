import multer from "multer"
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './temp/profileimg')
    },

    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); 
        const fileName = file.originalname.slice(0, 12); 
        cb(null, fileName + ext); 
    }
  })
  
  const UploadPfp = multer({ storage: storage })

  export default UploadPfp;