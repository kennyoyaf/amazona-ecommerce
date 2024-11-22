const path = require('path');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const images = [
  '../images/pants1.jpg',
  '../images/pants2.jpg',
  '../images/pants3.jpg',
  '../images/shirt1.jpg',
  '../images/shirt2.jpg',
  '../images/shirt3.jpg'
];

async function run() {
  for (const image of images) {
    try {
      const absolutePath = path.resolve(__dirname, image); // Convert to absolute path
      const result = await cloudinary.uploader.upload(absolutePath);
      console.log(result.secure_url); // Print Cloudinary URL
    } catch (error) {
      console.error(`Error uploading ${image}:`, error.message);
    }
  }
}

run();
