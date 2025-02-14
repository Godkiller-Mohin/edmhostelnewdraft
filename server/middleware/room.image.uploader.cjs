const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

// Utility function to create necessary upload directories
const uploadPath = () => {
  const UPLOADS_FOLDER = './public/uploads/rooms';

  // If the 'uploads' folder doesn't exist, create it
  if (!fs.existsSync('./public/uploads')) {
    fs.mkdirSync('./public/uploads', { recursive: true });
  }

  // If the 'rooms' folder doesn't exist, create it
  if (!fs.existsSync(UPLOADS_FOLDER)) {
    fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
  }

  return UPLOADS_FOLDER;
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath()); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname); // Extract file extension
    const fileName = `${file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-')}-${Date.now()}`;
    cb(null, fileName + fileExt); // Unique file name to avoid overwriting
  }
});

// Multer upload configuration
const roomImageUpload = multer({
  storage,
  limits: {
    fileSize: 1000000 // 1MB size limit for each image
  },
  fileFilter: (_req, file, cb) => {
    // Accept only certain file types
    if (file.fieldname === 'room_images') {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
      } else {
        cb(new Error('Only .jpg, .png or .jpeg format allowed!'));
      }
    } else {
      cb(new Error('There was an unknown error!'));
    }
  }
});

module.exports = { roomImageUpload };
