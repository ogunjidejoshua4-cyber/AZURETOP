const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/uploadController');
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, upload.single('image'), uploadImage);

module.exports = router;