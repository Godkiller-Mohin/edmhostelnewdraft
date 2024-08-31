const mongoose = require('mongoose');
const { validateBookingDates } = require('../lib/booking.dates.validator');

const bookingEventSchema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Events',
    required: [true, 'Event id is a required field']
  },
  booking_dates: {
    type: [Date],
    required: [true, 'Booking dates are required'],
    validate: [validateBookingDates, 'Please provide valid future dates for booking']
  },
  booking_status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'cancel', 'approved', 'rejected', 'in-reviews', 'completed'],
    required: [true, 'Booking status is a required field']
  },
  booked_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'User id is a required field']
  },
  reviews: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reviews'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field before saving or updating a document
bookingEventSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('BookingEvents', bookingEventSchema);
