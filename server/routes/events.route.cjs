const express = require('express');
const { createEvent, getEventsList, getEventByIdOrSlugName, editEventByAdmin, deleteEventById, getFeaturedEventsList } = require('../controllers/event.vontroller.cjs');
//const { upload } = require('../middleware/file.upload.cjs'); // Assuming you have middleware for file uploads
const router = express.Router();

// Route to create a new event
router.post('/create', upload.array('event_images', 10), createEvent);

// Route to get a list of all events
router.get('/list', getEventsList);

// Route to get a specific event by ID or slug
router.get('/:id', getEventByIdOrSlugName);

// Route to edit an event by admin
//router.put('/edit/:id', upload.array('event_images', 10), editEventByAdmin);

// Route to delete an event by ID
router.delete('/delete/:id', deleteEventById);

// Route to get a list of featured events
router.get('/featured', getFeaturedEventsList);

module.exports = router;
