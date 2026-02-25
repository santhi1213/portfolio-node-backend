const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config();

// Import database connection
const connectDB = require('./config/database');

// Import models
const User = require('./models/User');

// Import routes
const authRoutes = require('./routes/authRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const contactRoutes = require('./routes/contactRoutes');
const skillRoutes = require('./routes/skillRoutes');
const projectRoutes = require('./routes/projectRoutes');
const mailRoutes = require('./routes/mailRoutes');

// Initialize express app
const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: 'https://myportfolio-theta-vert.vercel.app', // Your React app URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/skill', skillRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/mail', mailRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Initialize default admin user
// Initialize default admin user
const initializeAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ email: process.env.DEFAULT_ADMIN_EMAIL });
    
    if (!adminExists) {
      // Create admin user directly without going through middleware
      const user = new User({
        name: 'Portfolio Admin',
        email: process.env.DEFAULT_ADMIN_EMAIL,
        password: process.env.DEFAULT_ADMIN_PASSWORD, // Will be hashed by pre-save hook
        role: 'admin'
      });
      
      await user.save();
      console.log('✅ Default admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      message: 'File size too large. Maximum size is 5MB.' 
    });
  }
  
  if (err.message.includes('Only image files are allowed')) {
    return res.status(400).json({ 
      message: 'Invalid file type. Only image files are allowed.' 
    });
  }
  
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Start server
const PORT = process.env.PORT || 5065;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Initialize admin user
    await initializeAdminUser();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
      console.log(`👤 Registration: POST http://localhost:${PORT}/api/auth/register`);
      console.log(`🔐 Login: POST http://localhost:${PORT}/api/auth/login`);
      console.log(`📧 Default Admin: ${process.env.DEFAULT_ADMIN_EMAIL}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();