// Import necessary modules
const Room = require('../models/room.model.cjs');
const Booking = require('../models/booking.room.model.cjs');
const { errorResponse, successResponse } = require('../configs/app.response');
const MyQueryHelper = require('../configs/api.feature');
const { bookingDatesBeforeCurrentDate } = require('../lib/booking.dates.validator');

// Controller for placing a booking order
const placedBookingOrder = async (req, res) => {
  try {
    let myRoom = null;

    // Validate room ID
    if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      myRoom = await Room.findById(req.params.id);
    } else {
      return res.status(400).json(errorResponse(
        1,
        'FAILED',
        'Invalid or missing room ID.'
      ));
    }

    // Check if room exists
    if (!myRoom) {
      return res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'Room does not exist.'
      ));
    }

    // Check room availability
    if (myRoom.room_status === 'unavailable' || myRoom.room_status === 'booked') {
      return res.status(400).json(errorResponse(
        1,
        'FAILED',
        'The selected room is not available.'
      ));
    }

    // Fetch booking type from room type
    const booking_type = myRoom.room_type; // Assuming `room_type` in `Room` model contains "single" or "dormitory"

    // Validate booking type-specific fields
    const { booking_dates, beds_booked } = req.body;

    if (booking_type === 'single') {
      if (!beds_booked || beds_booked < 1) {
        return res.status(400).json(errorResponse(
          1,
          'FAILED',
          'For single booking type, at least one bed must be booked.'
        ));
      }
    }

    // Prepare booking data
    const data = {
      room_id: req.params.id,
      booking_dates,
      booking_by: req.user.id,
      booking_type,
      beds_booked: booking_type === 'single' ? beds_booked : undefined
    };

    // Create booking
    const booking = await Booking.create(data);

    // Success response
    res.status(201).json(successResponse(
      0,
      'SUCCESS',
      'Your room booking order was placed successfully. Please wait for confirmation.',
      booking
    ));
  } catch (error) {
    // Handle server-side error
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      error.message || 'An unexpected error occurred.'
    ));
  }
};



// Controller for getting all bookings by a specific user
const getBookingOrderByUserId = async (req, res) => {
  try {
    const myBooking = await Booking.find({ booking_by: req.user.id })
      .populate('room_id')
      .populate('booking_by')
      .populate({
        path: 'reviews',
        populate: { path: 'user_id', model: 'Users' }
      });

    if (!myBooking || myBooking.length === 0) {
      return res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'No bookings found for the specified user'
      ));
    }

    const bookingQuery = new MyQueryHelper(Booking.find({ booking_by: req.user.id })
      .populate('room_id')
      .populate('booking_by')
      .populate({ path: 'reviews', populate: { path: 'user_id', model: 'Users' } }), req.query)
      .sort()
      .paginate();
    const findBooking = await bookingQuery.query;

    const mapperBooking = findBooking?.map((data) => ({
      id: data?.id,
      booking_dates: data?.booking_dates,
      booking_status: data?.booking_status,
      reviews: data?.reviews ? {
        id: data?.reviews.id,
        room_id: data?.reviews.room_id,
        booking_id: data?.reviews.booking_id,
        rating: data?.reviews.rating,
        message: data?.reviews.message,
        reviews_by: {
          id: data?.reviews?.user_id?._id,
          userName: data?.reviews?.user_id?.userName,
          fullName: data?.reviews?.user_id?.fullName,
          email: data?.reviews?.user_id?.email,
          phone: data?.reviews?.user_id?.phone,
          avatar: process.env.APP_BASE_URL + data?.reviews?.user_id?.avatar,
          gender: data?.reviews?.user_id?.gender,
          dob: data?.reviews?.user_id?.dob,
          address: data?.reviews?.user_id?.address,
          role: data?.reviews?.user_id?.role,
          verified: data?.reviews?.user_id?.verified,
          status: data?.reviews?.user_id?.status,
          createdAt: data?.reviews?.user_id?.createdAt,
          updatedAt: data?.reviews?.user_id?.updatedAt
        },
        created_at: data?.reviews?.createdAt,
        updated_at: data?.reviews?.updatedAt
      } : null,
      booking_by: {
        id: data?.booking_by?._id,
        userName: data?.booking_by?.userName,
        fullName: data?.booking_by?.fullName,
        email: data?.booking_by?.email,
        phone: data?.booking_by?.phone,
        avatar: process.env.APP_BASE_URL + data?.booking_by?.avatar,
        gender: data?.booking_by?.gender,
        dob: data?.booking_by?.dob,
        address: data?.booking_by?.address,
        role: data?.booking_by?.role,
        verified: data?.booking_by?.verified,
        status: data?.booking_by?.status,
        createdAt: data?.booking_by?.createdAt,
        updatedAt: data?.booking_by?.updatedAt
      },
      room: {
        id: data?.room_id?._id,
        room_name: data?.room_id?.room_name,
        room_slug: data?.room_id?.room_slug,
        room_type: data?.room_id?.room_type,
        room_price: data?.room_id?.room_price,
        room_size: data?.room_id?.room_size,
        room_capacity: data?.room_id?.room_capacity,
        allow_pets: data?.room_id?.allow_pets,
        provide_breakfast: data?.room_id?.provide_breakfast,
        featured_room: data?.room_id?.featured_room,
        room_description: data?.room_id?.room_description,
        room_status: data?.room_id?.room_status,
        extra_facilities: data?.room_id?.extra_facilities,
        room_images: data?.room_id?.room_images?.map(img => ({ url: process.env.APP_BASE_URL + img.url }))
      },
      created_at: data?.createdAt,
      updated_at: data?.updatedAt
    }));

    res.status(200).json(successResponse(
      0,
      'SUCCESS',
      'Booking list retrieved successfully',
      {
        rows: mapperBooking,
        total_rows: myBooking.length,
        response_rows: findBooking.length,
        total_page: req?.query?.keyword ? Math.ceil(findBooking.length / req.query.limit) : Math.ceil(myBooking.length / req.query.limit),
        current_page: req?.query?.page ? parseInt(req.query.page, 10) : 1
      }
    ));
  } catch (error) {
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      error
    ));
  }
};

// Controller for canceling self booking order
const cancelSelfBookingOrder = (req, res) => {
  const bookingId = req.params.bookingId;

  Booking.findByIdAndDelete(bookingId)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.status(200).json({ message: 'Booking canceled successfully' });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error canceling booking', error });
    });
};


// Controller for getting all booking orders (admin)
const getBookingOrderForAdmin = async (req, res) => {
  try {
    const myBooking = await Booking.find()
      .populate('room_id')
      // .populate('booking_by')
      .populate({
        path: 'reviews',
        populate: { path: 'user_id', model: 'Users' }
      });

    // if (!myBooking || myBooking.length === 0) {
    //   return res.status(404).json(errorResponse(
    //     4,
    //     'UNKNOWN ACCESS',
    //     'No bookings found for the specified user'
    //   ));
    // }

    const bookingQuery = new MyQueryHelper(Booking.find()
      .populate('room_id')
      // .populate('booking_by')
      .populate({ path: 'reviews', populate: { path: 'user_id', model: 'Users' } }), req.query)
      .sort()
      .paginate();
    const findBooking = await bookingQuery.query;

    const mapperBooking = findBooking?.map((data) => ({
      id: data?.id,
      booking_dates: data?.booking_dates,
      booking_status: data?.booking_status,
      reviews: data?.reviews ? {
        id: data?.reviews.id,
        room_id: data?.reviews.room_id,
        booking_id: data?.reviews.booking_id,
        rating: data?.reviews.rating,
        message: data?.reviews.message,
        reviews_by: {
          id: data?.reviews?.user_id?._id,
          userName: data?.reviews?.user_id?.userName,
          fullName: data?.reviews?.user_id?.fullName,
          email: data?.reviews?.user_id?.email,
          phone: data?.reviews?.user_id?.phone,
          avatar: process.env.APP_BASE_URL + data?.reviews?.user_id?.avatar,
          gender: data?.reviews?.user_id?.gender,
          dob: data?.reviews?.user_id?.dob,
          address: data?.reviews?.user_id?.address,
          role: data?.reviews?.user_id?.role,
          verified: data?.reviews?.user_id?.verified,
          status: data?.reviews?.user_id?.status,
          createdAt: data?.reviews?.user_id?.createdAt,
          updatedAt: data?.reviews?.user_id?.updatedAt
        },
        created_at: data?.reviews?.createdAt,
        updated_at: data?.reviews?.updatedAt
      } : null,
      booking_by: {
        id: data?.booking_by?._id,
        userName: data?.booking_by?.userName,
        fullName: data?.booking_by?.fullName,
        email: data?.booking_by?.email,
        phone: data?.booking_by?.phone,
        avatar: process.env.APP_BASE_URL + data?.booking_by?.avatar,
        gender: data?.booking_by?.gender,
        dob: data?.booking_by?.dob,
        address: data?.booking_by?.address,
        role: data?.booking_by?.role,
        verified: data?.booking_by?.verified,
        status: data?.booking_by?.status,
        createdAt: data?.booking_by?.createdAt,
        updatedAt: data?.booking_by?.updatedAt
      },
      room: {
        id: data?.room_id?._id,
        room_name: data?.room_id?.room_name,
        room_slug: data?.room_id?.room_slug,
        room_type: data?.room_id?.room_type,
        room_price: data?.room_id?.room_price,
        room_size: data?.room_id?.room_size,
        room_capacity: data?.room_id?.room_capacity,
        allow_pets: data?.room_id?.allow_pets,
        provide_breakfast: data?.room_id?.provide_breakfast,
        featured_room: data?.room_id?.featured_room,
        room_description: data?.room_id?.room_description,
        room_status: data?.room_id?.room_status,
        extra_facilities: data?.room_id?.extra_facilities,
        room_images: data?.room_id?.room_images?.map(img => ({ url: process.env.APP_BASE_URL + img.url }))
      },
      created_at: data?.createdAt,
      updated_at: data?.updatedAt
    }));

    res.status(200).json(successResponse(
      0,
      'SUCCESS',
      'Booking list retrieved successfully',
      {
        rows: mapperBooking,
        total_rows: myBooking.length,
        response_rows: findBooking.length,
        total_page: req?.query?.keyword ? Math.ceil(findBooking.length / req.query.limit) : Math.ceil(myBooking.length / req.query.limit),
        current_page: req?.query?.page ? parseInt(req.query.page, 10) : 1
      }
    ));
  } catch (error) {
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      error
    ));
  }
};

// Controller for updating a booking order by admin
const updatedBookingOrderByAdmin = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const update = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(bookingId, update, { new: true });

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      message: 'Booking updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error });
  }
};

// Export the functions
module.exports = {
  placedBookingOrder,
  getBookingOrderByUserId,
  cancelSelfBookingOrder,
  getBookingOrderForAdmin,
  updatedBookingOrderByAdmin
};
