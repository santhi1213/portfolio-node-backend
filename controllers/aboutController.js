const About = require('../models/About');

// @desc    Get about info
// @route   GET /api/About
// @access  Public
const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    
    if (!about) {
      // Create default about info
      about = await About.create({
        name: 'Santhi Raju',
        title: 'MERN Stack Developer',
        bio: 'Passionate full-stack developer specializing in MERN stack technologies with 1+ years of hands-on experience.',
        experience: '1+ Years Experience',
        projectsCompleted: '25+ Projects Completed',
        availability: 'Available for new projects'
      });
    }
    
    res.status(200).json(about);
  } catch (error) {
    console.error('Get about error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create or update about info
// @route   POST /api/About
// @route   PUT /api/About
// @access  Private
const saveAbout = async (req, res) => {
  try {
    const { id, name, title, bio, experience, projectsCompleted, availability } = req.body;
    
    let about;
    
    if (id) {
      // Update existing
      about = await About.findByIdAndUpdate(
        id,
        {
          name,
          title,
          bio,
          experience,
          projectsCompleted,
          availability,
          updatedAt: Date.now()
        },
        { new: true, runValidators: true }
      );
      
      if (!about) {
        return res.status(404).json({ message: 'About info not found' });
      }
    } else {
      // Create new
      about = await About.create({
        name,
        title,
        bio,
        experience,
        projectsCompleted,
        availability
      });
    }
    
    res.status(200).json(about);
  } catch (error) {
    console.error('Save about error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAbout,
  saveAbout
};