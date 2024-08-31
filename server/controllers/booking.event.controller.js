// Import necessary modules
const Event = require('../models/event.model.cjs'); // Assuming you have an Event model
const BookingEvent = require('../models/booking.event.model.cjs'); // The BookingEvents model you created
const { errorResponse, successResponse } = require('../configs/app.response');
const MyQueryHelper = require('../configs/api.feature');
const { bookingDatesBeforeCurrentDate } = require('../lib/booking.dates.validator');

// Controller for placing a booking event order
const placeBookingEventOrder = async (req, res) => {
  try {
    let myEvent = null;

    // Validate Event ID format
    if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      myEvent = await Event.findById(req.params.id);
    } else {
      return res.status(400).json(errorResponse(
        1,
        'FAILED',
        'Invalid event ID. Please provide a correct event ID.'
      ));
    }

    // Check if Event exists
    if (!myEvent) {
      return res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'Event does not exist.'
      ));
    }

    // Check Event availability
    if (myEvent.event_status === 'unavailable' || myEvent.event_status === 'booked') {
      return res.status(400).json(errorResponse(
        1,
        'FAILED',
        'Sorry! The selected event is not available for booking.'
      ));
    }

    // Prepare booking data
    const data = {
      event_id: req.params.id,
      booking_dates: req.body.booking_dates,
      booked_by: req.user.id
    };

    // Create Booking Event
    const bookingEvent = await BookingEvent.create(data);

    // Respond with success
    res.status(201).json(successResponse(
      0,
      'SUCCESS',
      'Your event booking order was placed successfully. Please wait for confirmation.',
      bookingEvent
    ));
  } catch (error) {
    console.error('Error placing event booking:', error);
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      'An error occurred while placing the booking. Please try again later.'
    ));
  }
};

// Controller for getting all booking events by a specific user
const getBookingEventOrderByUserId = async (req, res) => {
  try {
    const myBookings = await BookingEvent.find({ booked_by: req.user.id })
      .populate('event_id')
      .populate('booked_by')
      .populate({
        path: 'reviews',
        populate: { path: 'user_id', model: 'Users' }
      });

    if (!myBookings || myBookings.length === 0) {
      return res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'No event bookings found for the specified user.'
      ));
    }

    // Apply query features (sorting, pagination, filtering)
    const bookingQuery = new MyQueryHelper(
      BookingEvent.find({ booked_by: req.user.id })
        .populate('event_id')
        .populate('booked_by')
        .populate({
          path: 'reviews',
          populate: { path: 'user_id', model: 'Users' }
        }),
      req.query
    ).sort().paginate();

    const findBookings = await bookingQuery.query;

    // Map bookings to desired response format
    const mapperBookings = findBookings.map((data) => ({
      id: data.id,
      booking_dates: data.booking_dates,
      booking_status: data.booking_status,
      reviews: data.reviews ? {
        id: data.reviews.id,
        event_id: data.reviews.event_id,
        booking_id: data.reviews.booking_id,
        rating: data.reviews.rating,
        message: data.reviews.message,
        reviews_by: {
          id: data.reviews.user_id._id,
          userName: data.reviews.user_id.userName,
          fullName: data.reviews.user_id.fullName,
          email: data.reviews.user_id.email,
          phone: data.reviews.user_id.phone,
          avatar: process.env.APP_BASE_URL + data.reviews.user_id.avatar,
          gender: data.reviews.user_id.gender,
          dob: data.reviews.user_id.dob,
          address: data.reviews.user_id.address,
          role: data.reviews.user_id.role,
          verified: data.reviews.user_id.verified,
          status: data.reviews.user_id.status,
          createdAt: data.reviews.user_id.createdAt,
          updatedAt: data.reviews.user_id.updatedAt
        },
        created_at: data.reviews.createdAt,
        updated_at: data.reviews.updatedAt
      } : null,
      booked_by: {
        id: data.booked_by._id,
        userName: data.booked_by.userName,
        fullName: data.booked_by.fullName,
        email: data.booked_by.email,
        phone: data.booked_by.phone,
        avatar: process.env.APP_BASE_URL + data.booked_by.avatar,
        gender: data.booked_by.gender,
        dob: data.booked_by.dob,
        address: data.booked_by.address,
        role: data.booked_by.role,
        verified: data.booked_by.verified,
        status: data.booked_by.status,
        createdAt: data.booked_by.createdAt,
        updatedAt: data.booked_by.updatedAt
      },
      event: {
        id: data.event_id._id,
        event_name: data.event_id.event_name,
        event_slug: data.event_id.event_slug,
        event_type: data.event_id.event_type,
        event_price: data.event_id.event_price,
        event_size: data.event_id.event_size,
        event_capacity: data.event_id.event_capacity,
        allow_pets: data.event_id.allow_pets,
        provide_breakfast: data.event_id.provide_breakfast, // Adjust if not applicable
        featured_event: data.event_id.featured_event,
        event_description: data.event_id.event_description,
        event_status: data.event_id.event_status,
        extra_facilities: data.event_id.extra_facilities,
        event_images: data.event_id.event_images.map(img => ({ url: process.env.APP_BASE_URL + img.url }))
      },
      created_at: data.createdAt,
      updated_at: data.updatedAt
    }));

    // Respond with mapped bookings and pagination info
    res.status(200).json(successResponse(
      0,
      'SUCCESS',
      'Event booking list retrieved successfully.',
      {
        rows: mapperBookings,
        total_rows: myBookings.length,
        response_rows: findBookings.length,
        total_page: req.query.limit ? Math.ceil(myBookings.length / req.query.limit) : 1,
        current_page: req.query.page ? parseInt(req.query.page, 10) : 1
      }
    ));
  } catch (error) {
    console.error('Error retrieving event bookings:', error);
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      'An error occurred while retrieving the bookings. Please try again later.'
    ));
  }
};

// Controller for canceling a self event booking order
const cancelSelfBookingEventOrder = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    // Find the booking to ensure it belongs to the user
    const booking = await BookingEvent.findOne({ _id: bookingId, booked_by: req.user.id });

    if (!booking) {
      return res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'Booking not found or you do not have permission to cancel this booking.'
      ));
    }

    // Delete the booking
    await BookingEvent.findByIdAndDelete(bookingId);

    res.status(200).json(successResponse(
      0,
      'SUCCESS',
      'Event booking canceled successfully.'
    ));
  } catch (error) {
    console.error('Error canceling event booking:', error);
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      'An error occurred while canceling the booking. Please try again later.'
    ));
  }
};

// Controller for getting all booking events (admin)
const getBookingEventOrderForAdmin = async (req, res) => {
  try {
    const allBookings = await BookingEvent.find()
      .populate('event_id')
      .populate('booked_by')
      .populate({
        path: 'reviews',
        populate: { path: 'user_id', model: 'Users' }
      });

    if (!allBookings || allBookings.length === 0) {
      return res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'No event bookings found.'
      ));
    }

    // Apply query features (sorting, pagination, filtering)
    const bookingQuery = new MyQueryHelper(
      BookingEvent.find()
        .populate('event_id')
        .populate('booked_by')
        .populate({
          path: 'reviews',
          populate: { path: 'user_id', model: 'Users' }
        }),
      req.query
    ).sort().paginate();

    const findBookings = await bookingQuery.query;

    // Map bookings to desired response format
    const mapperBookings = findBookings.map((data) => ({
      id: data.id,
      booking_dates: data.booking_dates,
      booking_status: data.booking_status,
      reviews: data.reviews ? {
        id: data.reviews.id,
        event_id: data.reviews.event_id,
        booking_id: data.reviews.booking_id,
        rating: data.reviews.rating,
        message: data.reviews.message,
        reviews_by: {
          id: data.reviews.user_id._id,
          userName: data.reviews.user_id.userName,
          fullName: data.reviews.user_id.fullName,
          email: data.reviews.user_id.email,
          phone: data.reviews.user_id.phone,
          avatar: process.env.APP_BASE_URL + data.reviews.user_id.avatar,
          gender: data.reviews.user_id.gender,
          dob: data.reviews.user_id.dob,
          address: data.reviews.user_id.address,
          role: data.reviews.user_id.role,
          verified: data.reviews.user_id.verified,
          status: data.reviews.user_id.status,
          createdAt: data.reviews.user_id.createdAt,
          updatedAt: data.reviews.user_id.updatedAt
        },
        created_at: data.reviews.createdAt,
        updated_at: data.reviews.updatedAt
      } : null,
      booked_by: {
        id: data.booked_by._id,
        userName: data.booked_by.userName,
        fullName: data.booked_by.fullName,
        email: data.booked_by.email,
        phone: data.booked_by.phone,
        avatar: process.env.APP_BASE_URL + data.booked_by.avatar,
        gender: data.booked_by.gender,
        dob: data.booked_by.dob,
        address: data.booked_by.address,
        role: data.booked_by.role,
        verified: data.booked_by.verified,
        status: data.booked_by.status,
        createdAt: data.booked_by.createdAt,
        updatedAt: data.booked_by.updatedAt
      },
      event: {
        id: data.event_id._id,
        event_name: data.event_id.event_name,
        event_slug: data.event_id.event_slug,
        event_type: data.event_id.event_type,
        event_price: data.event_id.event_price,
        event_size: data.event_id.event_size,
        event_capacity: data.event_id.event_capacity,
        allow_pets: data.event_id.allow_pets,
        provide_breakfast: data.event_id.provide_breakfast, // Adjust if not applicable
        featured_event: data.event_id.featured_event,
        event_description: data.event_id.event_description,
        event_status: data.event_id.event_status,
        extra_facilities: data.event_id.extra_facilities,
        event_images: data.event_id.event_images.map(img => ({ url: process.env.APP_BASE_URL + img.url }))
      },
      created_at: data.createdAt,
      updated_at: data.updatedAt
    }));

    // Respond with mapped bookings and pagination info
    res.status(200).json(successResponse(
      0,
      'SUCCESS',
      'Event booking list retrieved successfully.',
      {
        rows: mapperBookings,
        total_rows: allBookings.length,
        response_rows: findBookings.length,
        total_page: req.query.limit ? Math.ceil(allBookings.length / req.query.limit) : 1,
        current_page: req.query.page ? parseInt(req.query.page, 10) : 1
      }
    ));
  } catch (error) {
    console.error('Error retrieving all event bookings:', error);
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      'An error occurred while retrieving the bookings. Please try again later.'
    ));
  }
};

// Controller for updating a booking event order by admin
const updateBookingEventOrderByAdmin = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const updateData = req.body;

    // Find and update the booking event
    const updatedBookingEvent = await BookingEvent.findByIdAndUpdate(bookingId, updateData, { new: true })
      .populate('event_id')
      .populate('booked_by')
      .populate({
        path: 'reviews',
        populate: { path: 'user_id', model: 'Users' }
      });

    if (!updatedBookingEvent) {
      return res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'Booking event not found.'
      ));
    }

    res.status(200).json(successResponse(
      0,
      'SUCCESS',
      'Event booking updated successfully.',
      updatedBookingEvent
    ));
  } catch (error) {
    console.error('Error updating event booking:', error);
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      'An error occurred while updating the booking. Please try again later.'
    ));
  }
};

// Export the controller functions
module.exports = {
  placeBookingEventOrder,
  getBookingEventOrderByUserId,
  cancelSelfBookingEventOrder,
  getBookingEventOrderForAdmin,
  updateBookingEventOrderByAdmin
};
