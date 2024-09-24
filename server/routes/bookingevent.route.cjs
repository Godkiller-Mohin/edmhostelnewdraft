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
const { isAuthenticatedUser, isAdmin } = require('../middleware/app.authentication.cjs');

// Routes for Event Booking

// Route to place a booking order for an event
router.post('/event/:id/book', isAuthenticatedUser, placeBookingEventOrder);

// Route to get all booking orders by the logged-in user
router.get('/user/bookings', isAuthenticatedUser, getBookingEventOrderByUserId);

// Route to cancel a booking order by the logged-in user
router.delete('/booking/:bookingId/cancel', isAuthenticatedUser, cancelSelfBookingEventOrder);

// Route to get all booking orders (for admin use)
router.get('/admin/bookings', isAuthenticatedUser, isAdmin, getBookingEventOrderForAdmin);

// Route to update a booking order by admin
router.put('/admin/booking/:bookingId', isAuthenticatedUser ,isAdmin, updateBookingEventOrderByAdmin);

module.exports = router;
