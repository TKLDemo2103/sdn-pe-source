const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer ID is required']
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Car ID is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  totalDays: {
    type: Number,
    min: [1, 'Total days must be at least 1']
  },
  pricePerDay: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  totalPrice: {
    type: Number,
    min: [0, 'Total price cannot be negative']
  },
  status: {
    type: String,
    enum: {
      values: ['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
      message: 'Status must be PENDING, CONFIRMED, ACTIVE, COMPLETED, or CANCELLED'
    },
    default: 'PENDING'
  },
  pickupLocation: {
    type: String,
    required: [true, 'Pickup location is required']
  },
  returnLocation: {
    type: String,
    required: [true, 'Return location is required']
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

BookingSchema.pre('validate', function(next) {
  if (this.startDate && this.endDate) {
    if (this.endDate <= this.startDate) {
      this.invalidate('endDate', 'End date must be after start date');
    }
  }
  next();
});

BookingSchema.pre('save', async function(next) {
  if (this.startDate && this.endDate && this.pricePerDay) {
    const diffTime = this.endDate.getTime() - this.startDate.getTime();
    this.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.totalPrice = this.totalDays * this.pricePerDay;
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
