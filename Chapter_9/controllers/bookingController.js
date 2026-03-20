const Booking = require('../models/Booking');
const Car = require('../models/Car');

exports.getBookingDetail = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'fullName email phone address role')
      .populate({
        path: 'carId',
        select: 'brand model year licensePlate type seats transmission fuelType pricePerDay location description features images status ownerId',
        populate: {
          path: 'ownerId',
          select: 'fullName email phone'
        }
      });

    if (!booking) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      error.code = 'BOOKING_NOT_FOUND';
      return next(error);
    }

    res.json({
      success: true,
      data: {
        booking: {
          _id: booking._id,
          startDate: booking.startDate,
          endDate: booking.endDate,
          totalDays: booking.totalDays,
          pricePerDay: booking.pricePerDay,
          totalPrice: booking.totalPrice,
          status: booking.status,
          pickupLocation: booking.pickupLocation,
          returnLocation: booking.returnLocation,
          notes: booking.notes,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
        },
        customer: booking.customerId,
        car: booking.carId
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customerId: req.params.id })
      .populate('carId', 'brand model year licensePlate type pricePerDay location images status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

exports.getOwnerBookings = async (req, res, next) => {
  try {
    const ownerId = req.headers['x-user-id'];

    if (!ownerId) {
      const error = new Error('Owner ID required in x-user-id header');
      error.statusCode = 401;
      error.code = 'UNAUTHORIZED';
      return next(error);
    }

    const ownerCars = await Car.find({ ownerId }).select('_id');
    const carIds = ownerCars.map(car => car._id);

    const bookings = await Booking.find({ carId: { $in: carIds } })
      .populate('customerId', 'fullName email phone')
      .populate('carId', 'brand model licensePlate pricePerDay location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

exports.getBookingSummary = async (req, res, next) => {
  try {
    const totalBookings = await Booking.countDocuments();

    const statusCounts = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const byStatus = {};
    statusCounts.forEach(item => {
      byStatus[item._id] = item.count;
    });

    res.json({
      success: true,
      data: {
        totalBookings,
        byStatus: {
          PENDING: byStatus.PENDING || 0,
          CONFIRMED: byStatus.CONFIRMED || 0,
          ACTIVE: byStatus.ACTIVE || 0,
          COMPLETED: byStatus.COMPLETED || 0,
          CANCELLED: byStatus.CANCELLED || 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
