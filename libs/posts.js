const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.join(__dirname, '..', 'database', 'users', 'posts');
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

const uploads = multer({ storage: storage }).single('image');

// Middleware to add watermark
const addWatermark = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  const { watermark } = req.body;
  const imagePath = req.file.path;

  console.log('JUST IN CASE', imagePath);
  console.log('MARK DE WATER', watermark);

  try {
    const outputImagePath = imagePath.replace(/\.[^/.]+$/, '-watermarked$&'); // Generate a unique filename for the watermarked image

    const watermarkText = watermark || 'Fotaza';
    await sharp(imagePath)
      .composite([{
        input: Buffer.from(`<svg height="100" width="520"><text x="30" y="75" font-family="Arial" font-size="90" fill="#CCC">${watermarkText}</text></svg>`),
        gravity: 'southeast',
      }])
      .toFile(outputImagePath); // Save the watermarked image to a different file

    // Update the req.file object with the path to the watermarked image
    req.file.path = outputImagePath;
    console.log('Output Image Path:', outputImagePath);


    next();
  } catch (error) {
    console.error('Error adding watermark:', error);
    return res.status(500).json({ message: 'Error adding watermark to the image' });
  }
};


module.exports = { uploads, addWatermark };
