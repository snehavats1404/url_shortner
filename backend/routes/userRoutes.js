// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyToken } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify', protect, verifyToken);

module.exports = router;