const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
  contractNumber: {
    type: String,
    required: [true, 'Contract number is required'],
    unique: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking ID is required']
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer ID is required']
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    default: ''
  },
  customerEmail: {
    type: String,
    default: ''
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Car ID is required']
  },
  carBrand: {
    type: String,
    required: true
  },
  carModel: {
    type: String,
    required: true
  },
  licensePlate: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalDays: {
    type: Number,
    required: true
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  pickupLocation: {
    type: String,
    required: true
  },
  returnLocation: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: {
      values: ['ACTIVE', 'COMPLETED', 'TERMINATED'],
      message: 'Status must be ACTIVE, COMPLETED, or TERMINATED'
    },
    default: 'ACTIVE'
  },
  terms: [{
    type: String
  }],
  signedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contract', ContractSchema);
