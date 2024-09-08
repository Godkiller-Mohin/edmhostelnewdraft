const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

// Import the controllers
const {
  placeBookingEventOrder,
  getBookingEventOrderByUserId,
  cancelSelfBookingEventOrder,
  getBookingEventOrderForAdmin,
  updateBookingEventOrderByAdmin
} = require('../controllers/booking.event.controller');

// Middleware for user authentication
const { protect, authorize } = require('../middleware/auth.cjs');

// Routes for Event Booking

// Route to place a booking order for an event
router.post('/event/:id/book', protect, placeBookingEventOrder);

// Route to get all booking orders by the logged-in user
router.get('/user/bookings', protect, getBookingEventOrderByUserId);

// Route to cancel a booking order by the logged-in user
router.delete('/booking/:bookingId/cancel', protect, cancelSelfBookingEventOrder);

// Route to get all booking orders (for admin use)
router.get('/admin/bookings', protect, authorize('admin'), getBookingEventOrderForAdmin);

// Route to update a booking order by admin
router.put('/admin/booking/:bookingId', protect, authorize('admin'), updateBookingEventOrderByAdmin);

module.exports = router;
