const Skill = require('../models/Skill');

// @desc    Get all skills
// @route   GET /api/Skill
// @access  Public
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, level: -1 });
    res.status(200).json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create skill
// @route   POST /api/Skill
// @access  Private
const createSkill = async (req, res) => {
  try {
    const { name, level, category } = req.body;
    
    const skill = await Skill.create({
      name,
      level,
      category
    });
    
    res.status(201).json(skill);
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update skill
// @route   PUT /api/Skill/:id
// @access  Private
const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, level, category } = req.body;
    
    const skill = await Skill.findByIdAndUpdate(
      id,
      {
        name,
        level,
        category
      },
      { new: true, runValidators: true }
    );
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.status(200).json(skill);
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete skill
// @route   DELETE /api/Skill/:id
// @access  Private
const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    
    const skill = await Skill.findByIdAndDelete(id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill
};