const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const {
  createEvent,
  getEventsList,
  getEventByIdOrSlugName,
  editEventByAdmin,
  deleteEventById,
  getFeaturedEventsList
} = require('../controllers/event.vontroller.cjs');
const { eventImageUpload } = require('../middleware/event.image.uploader.cjs'); // Assuming 'upload.cjs' contains your multer configuration for events
const { isAuthenticatedUser, isAdmin } = require('../middleware/app.authentication.cjs'); // Assuming these are authentication middlewares
const router = express.Router();

// Route to create a new event
router.post('/create', isAuthenticatedUser, isAdmin, eventImageUpload.array('event_images', 5), createEvent);

// Route to get a list of all events
router.get('/list', getEventsList);

// Route to get a specific event by ID or slug
router.get('/:id', getEventByIdOrSlugName);

// Route to edit an event by admin
router.put('/edit/:id', isAuthenticatedUser, isAdmin, eventImageUpload.array('event_images', 10), editEventByAdmin);

// Route to delete an event by ID
router.delete('/delete/:id', isAuthenticatedUser, isAdmin, deleteEventById);

// Route to get a list of featured events
router.get('/featured', getFeaturedEventsList);

module.exports = router;
