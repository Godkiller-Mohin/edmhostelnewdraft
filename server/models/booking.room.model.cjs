const mongoose = require('mongoose');
const { validateBookingDates } = require('../lib/booking.dates.validator');

const bookingSchema = new mongoose.Schema({
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rooms',
    required: [true, 'Room id is required field']
  },
  booking_dates: {
    type: [Date],
    required: [true, 'Booking `booking_dates` is required field'],
    validate: [validateBookingDates, 'Please provide valid future dates for `booking_dates`']
  },
  booking_status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'cancel', 'approved', 'rejected', 'in-reviews', 'completed'],
    required: [true, 'Room status is required field.']
  },
  booking_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'User id is required field']
  },
  booking_type: {
    type: String,
    required: [true, 'Booking type is required field.'],
    enum: ['single', 'dormitory'], // 'single' for per bed, 'dormitory' for fill room
  },
  beds_booked: {
    type: Number,
    required: function () {
      return this.booking_type === 'single';
    },
    min: [1, 'At least one bed must be booked for single booking type.'],
    validate: {
      validator: function (value) {
        return this.booking_type === 'dormitory' || value > 0;
      },
      message: 'Beds booked must be a positive number for single booking type.'
    }
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

// updatedAt' field before saving or updating a document
bookingSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Bookings', bookingSchema);
