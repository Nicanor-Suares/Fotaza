const path = require('path');
const multer = require('multer');

let storage = multer.diskStorage({
  destination : (req, file, cb) => {
    cb(null, './users/avatars');
  },
  filename : (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

let uploads = multer({storage : storage}).single('avatar');

module.exports = uploads;