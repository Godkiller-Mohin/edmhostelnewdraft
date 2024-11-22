const fs = require('fs');
const path = require('path');
const appRoot = require('app-root-path');
const Event = require('../models/event.model.cjs');
const logger = require('../middleware/winston.logger.cjs');
const { errorResponse, successResponse } = require('../configs/app.response');
const MyQueryHelper = require('../configs/api.feature');
const multer = require('multer');

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
      event_name, event_slug, event_type, event_date, event_duration, event_capacity, allow_guests, provide_meals,
      featured_event, event_description, organized_by, forming_artists,event_timings,event_theme
    } = req.body;

    // Validate required fields
    if (!event_name || !event_slug || !event_type || !event_date) {
      return res.status(400).json(errorResponse(1, 'FAILED', '`event_name`, `event_slug`, `event_type`, and `event_date` fields are required'));
    }

    // Check if event already exists
    const existingEvent = await Event.findOne({ event_slug });
    if (existingEvent) {
      return res.status(409).json(errorResponse(9, 'ALREADY EXIST', '`event_slug` already exists'));
    }

    // Prepare event data to store in the database
    const data = {
      event_name,
      event_slug,
      event_type,
      event_date,
      event_duration: Number(event_duration),
      event_capacity: Number(event_capacity),
      allow_guests: Boolean(allow_guests),
      provide_meals: Boolean(provide_meals),
      featured_event: Boolean(featured_event),
      event_description,
      organized_by,
      event_theme,
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
      event_theme:data.event_theme,
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
const getEventByIdOrSlugName = async (req, res) => {
  try {
    let event = null;

    if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      event = await Event.findById(req.params.id).populate('created_by');
    } else {
      event = await Event.findOne({ event_slug: req.params.id }).populate('created_by');
    }

    if (!event) {
      return res.status(404).json(errorResponse(4, 'UNKNOWN ACCESS', 'Event does not exist'));
    }

    const organizedEvent = {
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
      event_theme:event.event_theme,
      performing_artists:event.performing_artists,
      event_timings:event.event_timings,
      event_description: event.event_description,
      event_images: event.event_images.map((img) => ({ url: process.env.APP_BASE_URL + img.url })),
      created_by: event.created_by ? {
        id: event.created_by._id,
        userName: event.created_by.userName,
        fullName: event.created_by.fullName,
        email: event.created_by.email,
        phone: event.created_by.phone,
        avatar: process.env.APP_BASE_URL + event.created_by.avatar,
        gender: event.created_by.gender,
        dob: event.created_by.dob,
        address: event.created_by.address,
        role: event.created_by.role,
        verified: event.created_by.verified,
        status: event.created_by.status,
        createdAt: event.created_by.createdAt,
        updatedAt: event.created_by.updatedAt
      } : null,
      created_at: event.createdAt,
      updated_at: event.updatedAt
    };

    // Success response
    res.status(200).json(successResponse(0, 'SUCCESS', 'Event information retrieved successfully', organizedEvent));
  } catch (error) {
    res.status(500).json(errorResponse(2, 'SERVER SIDE ERROR', error));
  }
};

// Controller for editing an event by admin
const editEventByAdmin = async (req, res) => {
  try {
    const {
      event_name, event_slug, event_type, event_date, event_duration, event_capacity, allow_guests, provide_meals,
      featured_event, event_description, organized_by
    } = req.body;

    // Validate required fields
    if (!event_name || !event_slug || !event_type || !event_date) {
      return res.status(400).json(errorResponse(1, 'FAILED', '`event_name`, `event_slug`, `event_type`, and `event_date` fields are required'));
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
        allow_guests: Boolean(allow_guests),
        provide_meals: Boolean(provide_meals),
        featured_event: Boolean(featured_event),
        event_description,
        event_theme,
        forming_artists,
        event_timings,
        organized_by,
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
  getEventByIdOrSlugName,
  editEventByAdmin,
  deleteEventById,
  getFeaturedEventsList,
  upload
};
