// routes/urlRoutes.js
const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  createShortUrl,
  getUrlAnalytics,
  redirectToUrl,
  getUserUrls
} = require('../controllers/urlController');
router.get('/s/:shortId', redirectToUrl);
router.post('/', protect, createShortUrl);
router.get('/analytics/:shortId', protect, getUrlAnalytics);
router.get('/user', protect, getUserUrls);


module.exports = router;
