const Location = require('../models/Location');

exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true });
    res.json({ success: true, count: locations.length, locations });
  } catch (error) {
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
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchLocations = async (req, res) => {
  try {
    const { airport, checkIn, checkOut } = req.query;
    
    const query = { isActive: true };
    if (airport) {
      query['airport.code'] = airport.toUpperCase();
    }

    const locations = await Location.find(query);
    res.json({ success: true, count: locations.length, locations });
  } catch (error) {
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

    const available = location.capacity.available > 0;
    
    res.json({
      success: true,
      available,
      capacity: location.capacity
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};