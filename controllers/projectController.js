const Project = require('../models/Project');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

// @desc    Get all projects
// @route   GET /api/project
// @access  Public
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ featured: -1, createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create project
// @route   POST /api/project
// @access  Private
const createProject = async (req, res) => {
  try {
    const { Title, Description, Category, Github, Live, Featured, Technologies } = req.body;
    
    let imageUrl = '';
    let imageContentType = '';
    
    // Handle image upload
    if (req.file) {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'portfolio/projects'
        });
        
        imageUrl = result.secure_url;
        imageContentType = result.format;
        
        // Delete local file
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        // Delete local file if exists
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ message: 'Image upload failed' });
      }
    }
    
    // Convert Technologies string to array if needed
    let technologiesArray = [];
    if (Technologies) {
      if (typeof Technologies === 'string') {
        technologiesArray = Technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
      } else if (Array.isArray(Technologies)) {
        technologiesArray = Technologies;
      }
    }
    
    const project = await Project.create({
      title: Title,
      description: Description,
      image: imageUrl,
      imageContentType: imageContentType,
      technologies: technologiesArray,
      category: Category,
      github: Github || '',
      live: Live || '',
      featured: Featured === 'true' || Featured === true
    });
    
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    
    // Clean up file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update project
// @route   PUT /api/project/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { Title, Description, Category, Github, Live, Featured, Technologies } = req.body;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    let imageUrl = project.image;
    let imageContentType = project.imageContentType;
    
    // Handle image upload if new file provided
    if (req.file) {
      try {
        // Delete old image from Cloudinary if exists
        if (project.image && project.image.includes('cloudinary')) {
          const publicId = project.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`portfolio/projects/${publicId}`);
        }
        
        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'portfolio/projects'
        });
        
        imageUrl = result.secure_url;
        imageContentType = result.format;
        
        // Delete local file
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        // Delete local file if exists
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ message: 'Image upload failed' });
      }
    }
    
    // Convert Technologies string to array if needed
    let technologiesArray = project.technologies;
    if (Technologies) {
      if (typeof Technologies === 'string') {
        technologiesArray = Technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
      } else if (Array.isArray(Technologies)) {
        technologiesArray = Technologies;
      }
    }
    
    // Update project
    project.title = Title;
    project.description = Description;
    project.image = imageUrl;
    project.imageContentType = imageContentType;
    project.technologies = technologiesArray;
    project.category = Category;
    project.github = Github || '';
    project.live = Live || '';
    project.featured = Featured === 'true' || Featured === true;
    project.updatedAt = Date.now();
    
    await project.save();
    
    res.status(200).json(project);
  } catch (error) {
    console.error('Update project error:', error);
    
    // Clean up file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete project
// @route   DELETE /api/project/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Delete image from Cloudinary if exists
    if (project.image && project.image.includes('cloudinary')) {
      try {
        const publicId = project.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`portfolio/projects/${publicId}`);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
      }
    }
    
    await project.deleteOne();
    
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject
};