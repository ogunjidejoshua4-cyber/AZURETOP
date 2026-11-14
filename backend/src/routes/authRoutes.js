const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  registerUser,
  authUser,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const generateToken = require('../utils/generateToken');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);

// Google Auth Routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT token for Google-authenticated user and redirect to frontend with token
    const token = generateToken(req.user._id);
    // Redirect to frontend with token query parameter (we can refine this when building the frontend)
    res.redirect(`http://localhost:3000?token=${token}`);
  }
);

module.exports = router;