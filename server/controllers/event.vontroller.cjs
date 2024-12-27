const fs = require('fs');
const path = require('path');
const appRoot = require('app-root-path');
const Event = require('../models/event.model.cjs');
const logger = require('../middleware/winston.logger.cjs');
const { errorResponse, successResponse } = require('../configs/app.response');
const MyQueryHelper = require('../configs/api.feature');
const multer = require('multer');
const mongoose = require("mongoose")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(appRoot.path, 'uploads/events'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Controller for creating a new event
const createEvent = async (req, res) => {
  try {
    const {
      event_name, event_slug, event_type, event_date, event_duration, event_capacity, event_description, forming_artists,event_timings,event_genre,event_price
    } = req.body;

    // Validate required fields
    if (!event_name || !event_date) {
      return res.status(400).json(errorResponse(1, 'FAILED', '`event_name` and `event_date` fields are required'));
    }

    // Check if event already exists
    const existingEvent = await Event.findOne({ event_name });
    if (existingEvent) {
      return res.status(409).json(errorResponse(9, 'ALREADY EXIST', '`event_name` already exists'));
    }

    // Prepare event data to store in the database
    const data = {
      event_name,
      event_slug,
      event_type,
      event_date,
      event_duration: Number(event_duration),
      event_capacity: Number(event_capacity),
      event_description,
      event_genre,
      event_price,
      forming_artists,
      event_timings,
      event_images: req.files.map((file) => ({ url: `/uploads/events/${file.filename}` })),
      created_by: req.user.id
    };

    // Save event data in the database
    const event = await Event.create(data);

    // Success response
    res.status(201).json(successResponse(0, 'SUCCESS', 'New event created successfully', event));
  } catch (error) {
    // Error handling
    res.status(500).json(errorResponse(2, 'SERVER SIDE ERROR', error));
  }
};

// Controller for getting all events list
const getEventsList = async (req, res) => {
  try {
    // Filtering events based on different types of queries
    const eventQuery = new MyQueryHelper(Event.find(), req.query)
      .search('event_name')
      .sort()
      .paginate();
    const findEvents = await eventQuery.query;

    const mappedEvents = findEvents.map((data) => ({
      id: data._id,
      event_name: data.event_name,
      event_slug: data.event_slug,
      event_type: data.event_type,
      event_date: data.event_date,
      event_duration: data.event_duration,
      event_capacity: data.event_capacity,
      allow_guests: data.allow_guests,
      provide_meals: data.provide_meals,
      featured_event: data.featured_event,
      event_description: data.event_description,
      event_genre:data.event_genre,
      event_price:data.event_price,
      forming_artists:data.forming_artists,
      event_timings:data.event_timings,
      event_images: data.event_images.map((img) => ({ url: process.env.APP_BASE_URL + img.url })),
      created_by: data.created_by,
      created_at: data.createdAt,
      updated_at: data.updatedAt
    }));

    // Success response
    res.status(200).json(successResponse(0, 'SUCCESS', 'Events list found successfully', {
      rows: mappedEvents,
      total_rows: mappedEvents.length,
      response_rows: findEvents.length,
      total_page: Math.ceil(findEvents.length / (req.query.limit || 10)),
      current_page: parseInt(req.query.page, 10) || 1
    }));
  } catch (error) {
    res.status(500).json(errorResponse(2, 'SERVER SIDE ERROR', error));
  }
};

// Controller for finding an event by ID or event slug
const getEventById = async (req, res) => {
  try {
    let event = null;

    // If 'organized_by' is a string (like "anant"), fetch the user's ObjectId first
    if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      // If it's a valid ObjectId, fetch event by ID and populate 'organized_by' and 'created_by'
      event = await Event.findById(req.params.id)
        .populate('created_by', 'userName fullName email phone avatar gender dob address role status createdAt updatedAt');
    } else {
      // If it's not a valid ObjectId, try to fetch event by event_slug
      event = await Event.findOne({ event_slug: req.params.id })
        .populate('created_by', 'userName fullName email phone avatar gender dob address role status createdAt updatedAt');
    }

    // Check if event is found
    if (!event) {
      return res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'Event does not exist'
      ));
    }

    // If 'organized_by' is a string (e.g., "anant"), replace it with the user's ObjectId
    // if (typeof event.organized_by === 'string') {
    //   const user = await User.findOne({ userName: event.organized_by }); // Assuming you have a 'userName' field
    //   if (user) {
    //     event.organized_by = user._id; // Set the correct ObjectId
    //   } else {
    //     return res.status(404).json(errorResponse(
    //       4,
    //       'USER NOT FOUND',
    //       'Organizer user not found'
    //     ));
    //   }
    // }

    // Build the response object with necessary details
    const organizedEvent = {
      id: event._id,
      id: event._id,
      event_name: event.event_name,
      event_slug: event.event_slug,
      event_type: event.event_type,
      event_date: event.event_date,
      event_duration: event.event_duration,
      event_capacity: event.event_capacity,
      allow_guests: event.allow_guests,
      provide_meals: event.provide_meals,
      featured_event: event.featured_event,
      event_description: event.event_description,
      event_genre:event.event_genre,
      event_price:event.event_price,
      forming_artists:event.forming_artists,
      event_timings:event.event_timings,
      event_images: event.event_images.map((img) => ({ url: process.env.APP_BASE_URL + img.url })),
      created_by: event.created_by,
      created_at: event.createdAt,
      updated_at: event.updatedAt
    };

    // Return success response with the event data
    res.status(200).json(successResponse(
      0,
      'SUCCESS',
      'Event information retrieved successfully',
      organizedEvent
    ));
  } catch (error) {
    // Handle any server-side errors and respond with error
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      error.message || error
    ));
  }
};





// Controller for editing an event by admin
const editEventByAdmin = async (req, res) => {
  try {
    const {
      event_name, event_slug, event_type, event_date, event_duration, event_capacity, event_description, forming_artists,event_timings,event_genre,event_price

    } = req.body;

    // Validate required fields
    if (!event_name || !event_date) {
      return res.status(400).json(errorResponse(1, 'FAILED', '`event_name`,`event_date` fields are required'));
    }

    // Check if event exists
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json(errorResponse(4, 'UNKNOWN ACCESS', 'Event does not exist'));
    }

    // Update event info & save to the database
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        event_name,
        event_slug,
        event_type,
        event_date,
        event_duration: Number(event_duration),
        event_capacity: Number(event_capacity),
        event_description,
        event_genre,
        event_price,
        forming_artists,
        event_timings,
        event_images: req.files.map((file) => ({ url: `/uploads/events/${file.filename}` })),
        updatedAt: Date.now()
      },
      { runValidators: true, new: true }
    );

    // Success response
    res.status(201).json(successResponse(0, 'SUCCESS', 'Event updated successfully', updatedEvent));
  } catch (error) {
    res.status(500).json(errorResponse(2, 'SERVER SIDE ERROR', error));
  }
};

// Controller for deleting an event by ID
const deleteEventById = async (req, res) => {
  try {
    // Check if event exists
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json(errorResponse(4, 'UNKNOWN ACCESS', 'Event does not exist'));
    }

    // Delete event from the database
    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json(successResponse(0, 'SUCCESS', 'Event deleted successfully'));
  } catch (error) {
    res.status(500).json(errorResponse(2, 'SERVER SIDE ERROR', error));
  }
};

// Controller for getting featured events list
const getFeaturedEventsList = async (req, res) => {
  try {
    // Filtering featured events based on different types of queries
    const eventQuery = new MyQueryHelper(Event.find({ featured_event: true }), req.query)
      .search('event_name')
      .sort()
      .paginate();
    const findEvents = await eventQuery.query;

    const mappedEvents = findEvents.map((data) => ({
      id: data._id,
      event_name: data.event_name,
      event_slug: data.event_slug,
      event_type: data.event_type,
      event_date: data.event_date,
      event_duration: data.event_duration,
      event_capacity: data.event_capacity,
      allow_guests: data.allow_guests,
      provide_meals: data.provide_meals,
      featured_event: data.featured_event,
      event_description: data.event_description,
      event_theme:data.event_theme,
      performing_artists:data.performing_artists,
      event_timings:data.event_timings,
      event_genre:data.genre,
      event_images: data.event_images.map((img) => ({ url: process.env.APP_BASE_URL + img.url })),
      created_by: data.created_by,
      created_at: data.createdAt,
      updated_at: data.updatedAt
    }));

    // Success response
    res.status(200).json(successResponse(0, 'SUCCESS', 'Featured events list found successfully', {
      rows: mappedEvents,
      total_rows: mappedEvents.length,
      response_rows: findEvents.length,
      total_page: Math.ceil(findEvents.length / (req.query.limit || 10)),
      current_page: parseInt(req.query.page, 10) || 1
    }));
  } catch (error) {
    res.status(500).json(errorResponse(2, 'SERVER SIDE ERROR', error));
  }
};

module.exports = {
  createEvent,
  getEventsList,
  getEventById,
  editEventByAdmin,
  deleteEventById,
  getFeaturedEventsList,
  upload
};
