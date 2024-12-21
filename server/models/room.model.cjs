

const mongoose = require('mongoose');

const roomsSchema = new mongoose.Schema({
  room_name: {
    type: String,
    unique: true,
    required: [true, 'Room name filed is required']
  },
  room_slug: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: [false, 'Room slug filed is optional']
  },
  room_type: {
    type: String,
    enum: ['Private','Dormitory'],
    required: [true, 'Room type filed is required']
  },
  room_price: {
    type: Number,
    required: [true, 'Room price filed is required']
  },
  room_size: {
    type: String,
    required: [false, 'Room size filed is optional']
  },
  room_capacity: {
    type: Number,
    required: [true, 'Room capacity filed is required']
  },
  // allow_pets: {
  //   type: Boolean,
  //   default: false
  // },
  // provide_breakfast: {
  //   type: Boolean,
  //   default: false
  // },
  // featured_room: {
  //   type: Boolean,
  //   default: false
  // },
  room_description: {
    type: [String],
    required: [true, 'Room rules and description field is required']
  },
  extra_facilities: [String],
  room_images: {
    type: [
      {
        url: {
          type: String,
          required: [true, 'Room image field is required']
        }
      }
    ],
    validate: {
      validator: function (v) {
        return v.length === 1;
      },
      message: 'Only one room image is allowed'
    }
  }
  ,
  room_status: {
    type: String,
    enum: ['available', 'unavailable', 'booked'],
    required: [true, 'Room status filed is required'],
    default: 'available'
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'Room created by is required field']
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

// Replace spaces with dashes in room_slug before saving
roomsSchema.pre('save', function (next) {
  if (this.room_slug) {
    this.room_slug = this.room_slug.replace(/\s/g, '-');
  }
  next();
});

module.exports = mongoose.model('Rooms', roomsSchema);
