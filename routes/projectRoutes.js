const express = require('express');
const router = express.Router();
const { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getProjects);

// Protected routes
router.post('/', protect, upload.single('ImageFile'), createProject);
router.put('/:id', protect, upload.single('ImageFile'), updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;