const express = require('express');
const router = express.Router();
const { getAbout, saveAbout } = require('../controllers/aboutController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAbout);

// Protected routes
router.post('/', saveAbout);
router.put('/', saveAbout);

module.exports = router;