import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import config from '../config'

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
})

// Multer storage configuration with Cloudinary for a single image
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'services', // Folder in Cloudinary to store images
      public_id: `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}`, // Unique filename
      resource_type: 'image', // Specify the resource type
    }
  },
})

export const upload = multer({
  storage: storage,
}).fields([
  { name: 'image', maxCount: 1 }, // Main image field
  { name: 'icon', maxCount: 1 }, // Logo image field
])
