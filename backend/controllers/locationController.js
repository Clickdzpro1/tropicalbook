const Location = require('../models/Location');

exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.findAll({ isActive: true });
    res.json({ success: true, count: locations.length, locations });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }
    res.json({ success: true, location });
  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchLocations = async (req, res) => {
  try {
    const { airport, checkIn, checkOut } = req.query;

    const filters = { isActive: true };
    if (airport) {
      filters.airportCode = airport.toUpperCase();
    }

    const locations = await Location.findAll(filters);
    res.json({ success: true, count: locations.length, locations });
  } catch (error) {
    console.error('Search locations error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { locationId, checkIn, checkOut } = req.query;

    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    const available = location.capacity_available > 0;

    res.json({
      success: true,
      available,
      capacity: {
        total: location.capacity_total,
        available: location.capacity_available
      }
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
