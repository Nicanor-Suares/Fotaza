const fs = require('fs');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.join(__dirname, '..', 'database', 'users', 'posts');

    // Create the directory if it doesn't exist
    fs.mkdir(destinationPath, { recursive: true }, (err) => {
      if (err) {
        return cb(err, null);
      }
      cb(null, destinationPath);
    });
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const uploads = multer({ storage: storage }).single('post');

module.exports = uploads;
