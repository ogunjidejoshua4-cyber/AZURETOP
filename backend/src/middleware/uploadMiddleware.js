const multer = require('multer');
const path = require('path');

// Configure storage using memory storage so we can stream the file directly to Cloudinary
const storage = multer.memoryStorage();

// File filter to allow only image types
const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp|avif/;
  const mimetypes = /image\/(jpeg|jpg|png|webp|avif)/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, WEBP, AVIF) are allowed!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size limit
  fileFilter,
});

module.exports = upload;