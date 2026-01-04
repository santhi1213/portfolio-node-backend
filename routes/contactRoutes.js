const express = require('express');
const router = express.Router();
const { getContact, saveContact } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getContact);

// Protected routes
router.post('/',  saveContact);
router.put('/', saveContact);

module.exports = router;