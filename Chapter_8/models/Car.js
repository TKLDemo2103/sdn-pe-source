const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  licensePlate: {
    type: String,
    required: [true, 'License plate is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: {
      values: ['SEDAN', 'SUV', 'HATCHBACK', 'MPV', 'PICKUP'],
      message: 'Type must be SEDAN, SUV, HATCHBACK, MPV, or PICKUP'
    },
    required: [true, 'Car type is required']
  },
  seats: {
    type: Number,
    required: [true, 'Number of seats is required'],
    min: [2, 'Seats must be at least 2'],
    max: [50, 'Seats cannot exceed 50']
  },
  transmission: {
    type: String,
    enum: {
      values: ['AUTOMATIC', 'MANUAL'],
      message: 'Transmission must be AUTOMATIC or MANUAL'
    },
    required: [true, 'Transmission is required']
  },
  fuelType: {
    type: String,
    enum: {
      values: ['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID'],
      message: 'Fuel type must be GASOLINE, DIESEL, ELECTRIC, or HYBRID'
    },
    required: [true, 'Fuel type is required']
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: [0, 'Price cannot be negative']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  features: [{
    type: String
  }],
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: {
      values: ['PENDING_APPROVAL', 'AVAILABLE', 'RENTED', 'MAINTENANCE', 'SUSPENDED'],
      message: 'Invalid car status'
    },
    default: 'PENDING_APPROVAL'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Car', CarSchema);
