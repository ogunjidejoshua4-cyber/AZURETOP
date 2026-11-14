const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Helper function to upload buffer to Cloudinary using a stream
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'voltcart_products' }, // Folder name in your Cloudinary account
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
      message: 'Image uploaded successfully to Cloudinary',
    });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed: ' + error.message });
  }
};

module.exports = { uploadImage };