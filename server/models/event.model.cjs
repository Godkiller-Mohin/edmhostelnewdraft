const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  event_name: {
    type: String,
    unique: true,
    required: [true, 'Event name is required']
  },
  event_slug: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: [true, 'Event slug is required']
  },
  event_type: {
    type: String,
    enum: ['conference', 'workshop', 'seminar', 'webinar', 'meetup'],
    required: [true, 'Event type is required']
  },
  event_date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  event_duration: {
    type: Number, // Duration in hours
    required: [true, 'Event duration is required']
  },
  event_capacity: {
    type: Number,
    required: [true, 'Event capacity is required']
  },
  allow_guests: {
    type: Boolean,
    default: false
  },
  provide_meals: {
    type: Boolean,
    default: false
  },
  featured_event: {
    type: Boolean,
    default: false
  },
  event_description: {
    type: String,
    required: [true, 'Event description is required']
  },
  event_images: [
    {
      url: {
        type: String,
        required: [true, 'Event image URL is required']
      }
    }
  ],
  event_status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    required: [true, 'Event status is required'],
    default: 'scheduled'
  },
  organized_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'Organizer is required']
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

// Replace spaces with dashes in event_slug before saving
eventSchema.pre('save', function (next) {
  if (this.event_slug) {
    this.event_slug = this.event_slug.replace(/\s/g, '-');
  }
  next();
});

module.exports = mongoose.model('Events', eventSchema);
