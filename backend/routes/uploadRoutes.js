// Importing required modules and middleware
import express from 'express'; // Importing Express framework
import multer from 'multer'; // Importing Multer for handling file uploads
import { v2 as cloudinary } from 'cloudinary'; // Importing Cloudinary for cloud storage
import streamifier from 'streamifier'; // Importing Streamifier to convert file buffer to stream
import { isAdmin, isAuth } from '../utils.js'; // Importing custom authentication middleware

// Creating an instance of Multer for file upload
const upload = multer();
const uploadRouter = express.Router();

// Route to handle file uploads
uploadRouter.post(
  '/',
  isAuth, // Middleware to ensure user is authenticated
  isAdmin, // Middleware to ensure user is an admin
  upload.single('file'), // Handling a single file upload
  async (req, res) => {
    // Configuring Cloudinary with credentials
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Function to upload file stream to Cloudinary
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    // Uploading file stream to Cloudinary and sending result
    const result = await streamUpload(req);
    res.send(result);
  }
);

// Exporting the uploadRouter
export default uploadRouter;
