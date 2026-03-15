const express = require('express');
const { register, login, getMe, verifyOTP } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/verify-otp', verifyOTP);
router.get('/auth/me', protect, getMe);

module.exports = router;
