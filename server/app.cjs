const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Load environment variables from .env file
dotenv.config();

// Import routes using CommonJS
const authRoutes = require('./routes/auth.cjs');
const bookingRoomRoute = require('./routes/booking.route.cjs');
const roomRoute = require('./routes/room.route.cjs');
const appRoute = require('./routes/app.route.cjs');
const userRoute = require('./routes/user.routes.cjs');
const eventRoute = require('./routes/events.route.cjs');
const bookingEventroute = require('./routes/bookingevent.route.cjs');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Configure CORS
const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cors(corsConfig));

// Optional: Add logging middleware
app.use(morgan('dev'));

// Retrieve the port from environment variables or default to 4000
const port = process.env.PORT || 4000;

// MongoDB connection function
const connect = () => {
  mongoose.set('strictQuery', true);
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('MongoDB connected');
    })
    .catch((err) => {
      console.log('MongoDB connection error:', err);
    });
};

// Upload path setup for multer
const uploadPath = () => {
  const UPLOADS_FOLDER = './public/uploads/rooms';

  if (!fs.existsSync('./public/uploads')) {
    fs.mkdirSync('./public/uploads', { recursive: true });
  }

  if (!fs.existsSync(UPLOADS_FOLDER)) {
    fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
  }

  return UPLOADS_FOLDER;
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath()); // Upload destination
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname); // File extension
    const fileName = `${file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-')}-${Date.now()}`;
    cb(null, fileName + fileExt); // Ensure unique filenames
  }
});

// Multer upload configuration for room images
const roomImageUpload = multer({
  storage,
  limits: {
    fileSize: 1000000 // Max file size 1MB
  },
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === 'room_images') {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
      } else {
        cb(new Error('Only .jpg, .png or .jpeg format allowed!'));
      }
    } else {
      cb(new Error('Unknown error!'));
    }
  }
});

// Route to handle room image upload
app.post('/upload-room-image', roomImageUpload.single('room_images'), (req, res) => {
  res.json({
    message: 'File uploaded successfully',
    file: req.file // Information about the uploaded file
  });
});

// Serve static files for uploaded room images
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Define your API routes
app.use("/api/app", appRoute);
app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoomRoute);
app.use("/api/room", roomRoute);
app.use("/api/user", userRoute);
app.use("/api/event", eventRoute);
app.use("/api/bookevent", bookingEventroute);

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connect();
});
