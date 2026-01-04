const express = require('express');
const router = express.Router();
const { 
  getSkills, 
  createSkill, 
  updateSkill, 
  deleteSkill 
} = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getSkills);

// Protected routes
router.post('/', createSkill);
router.put('/:id', updateSkill);
router.delete('/:id', deleteSkill);

module.exports = router;