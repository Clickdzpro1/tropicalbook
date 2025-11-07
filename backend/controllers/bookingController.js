const Booking = require('../models/Booking');
const Location = require('../models/Location');
const User = require('../models/User');

exports.createBooking = async (req, res) => {
  try {
    const { locationId, vehicle, checkIn, checkOut, dailyRate } = req.body;

    const location = await Location.findById(locationId);
    if (!location || location.capacity.available <= 0) {
      return res.status(400).json({ success: false, message: 'Location unavailable' });
    }

    const booking = await Booking.create({
      user: req.user.id,
      location: locationId,
      vehicle,
      dates: { checkIn: new Date(checkIn), checkOut: new Date(checkOut) },
      pricing: { dailyRate },
      status: 'pending'
    });

    // Update location availability
    location.updateAvailability(-1);
    await location.save();

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('location', 'name airport')
      .sort('-createdAt');
    
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('location');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    Object.assign(booking, req.body);
    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason;
    await booking.save();

    // Restore location availability
    const location = await Location.findById(booking.location);
    location.updateAvailability(1);
    await location.save();

    res.json({ success: true, message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};