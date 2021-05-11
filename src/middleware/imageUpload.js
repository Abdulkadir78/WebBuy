const multer = require("multer");

const imageUpload = multer({
  limits: {
    // Maximum file size is 2MB
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      // this error is handled in the controller
      req.fileError = "Only images of type jpg, jpeg and png are allowed";
      return cb(null, false);
    }
    return cb(null, true);
  },
}).array("images", 3);

module.exports = imageUpload;
