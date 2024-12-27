const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Function to ensure the upload directories exist
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

// Define the storage engine for multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath()); // Set the destination folder for uploads
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname); // Extract file extension
    const fileName = `${file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-')}-${Date.now()}`; // Generate a unique file name
    cb(null, fileName + fileExt); // Store the file with the generated name
  }
});

// Set up the multer upload instance with file size limit and file type filtering
const roomImageUpload = multer({
  storage,
  limits: {
    fileSize: 1000000 // Limit file size to 1MB
  },
  fileFilter: (_req, file, cb) => {
    // Only allow image files with certain mime types
    if (file.fieldname === 'room_images') {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true); // Allow the file
      } else {
        cb(new Error('Only .jpg, .png or .jpeg formats allowed!')); // Reject the file
      }
    } else {
      cb(new Error('There was an unknown error!')); // Reject other fields
    }
  }
});

module.exports = { roomImageUpload };
