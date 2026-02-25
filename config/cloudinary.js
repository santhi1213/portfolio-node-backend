const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddkm920ry',
  api_key: process.env.CLOUDINARY_API_KEY || '353935299157181',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'ytAjRgEKNk5w7mo5gB1OJWntSsM',
});

module.exports = cloudinary;