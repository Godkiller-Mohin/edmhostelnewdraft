const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const uploadEventPath = () => {
  const UPLOADS_FOLDER = './public/uploads/events';

  // if the `uploads` folder does not exist, create it
  if (!fs.existsSync('./public/uploads')) {
    fs.mkdirSync('./public/uploads', { recursive: true });
  }

  // if the `events` folder does not exist, create it
  if (!fs.existsSync(UPLOADS_FOLDER)) {
    fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
  }

  return UPLOADS_FOLDER;
};

// Define the storage for event images
const eventStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadEventPath());
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName = `${file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-')}-${Date.now()}`;

    cb(null, fileName + fileExt);
  }
});

// Prepare the final multer upload object for event images
const eventImageUpload = multer({
  storage: eventStorage,
  limits: {
    fileSize: 2000000 // 2MB, you can adjust this limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === 'event_images') {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
      } else {
        cb(new Error('Only .jpg, .png, or .jpeg formats are allowed for event images!'));
      }
    } else {
      cb(new Error('There was an unknown error during event image upload!'));
    }
  }
});

module.exports = { eventImageUpload };
