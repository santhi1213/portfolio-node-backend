const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://santhiraju32_db_user:hMvYHRrQvS6TWsRS@cluster0.nysuteb.mongodb.net/?appName=Cluster0', {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,

    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;