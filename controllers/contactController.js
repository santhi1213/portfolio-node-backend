const Contact = require('../models/Contact');

// @desc    Get contact info
// @route   GET /api/Contact
// @access  Public
const getContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();
    
    if (!contact) {
      // Create default contact info
      contact = await Contact.create({
        email: 'santhiraju32@gmail.com',
        phone: '+91 9705675817',
        location: 'Andhra Pradesh, India',
        github: 'https://github.com/santhi1213',
        linkedin: 'https://www.linkedin.com/in/santhi-raju-0364ba248',
        twitter: '#'
      });
    }
    
    res.status(200).json(contact);
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create or update contact info
// @route   POST /api/Contact
// @route   PUT /api/Contact
// @access  Private
const saveContact = async (req, res) => {
  try {
    const { id, email, phone, location, github, linkedin, twitter } = req.body;
    
    let contact;
    
    if (id) {
      // Update existing
      contact = await Contact.findByIdAndUpdate(
        id,
        {
          email,
          phone,
          location,
          github,
          linkedin,
          twitter,
          updatedAt: Date.now()
        },
        { new: true, runValidators: true }
      );
      
      if (!contact) {
        return res.status(404).json({ message: 'Contact info not found' });
      }
    } else {
      // Create new
      contact = await Contact.create({
        email,
        phone,
        location,
        github,
        linkedin,
        twitter
      });
    }
    
    res.status(200).json(contact);
  } catch (error) {
    console.error('Save contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getContact,
  saveContact
};