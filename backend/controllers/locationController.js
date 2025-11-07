const supabase = require('../config/supabase');

exports.getLocations = async (req, res) => {
  try {
    const { data: locations, error } = await supabase
      .from('locations')
      .select('*')
      .eq('is_active', true);

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    res.json({ success: true, count: locations.length, locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLocation = async (req, res) => {
  try {
    const { data: location, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !location) {
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

    let query = supabase
      .from('locations')
      .select('*')
      .eq('is_active', true);

    if (airport) {
      query = query.eq('airport_code', airport.toUpperCase());
    }

    const { data: locations, error } = await query;

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    res.json({ success: true, count: locations.length, locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { locationId, checkIn, checkOut } = req.query;

    const { data: location, error } = await supabase
      .from('locations')
      .select('capacity_total, capacity_available')
      .eq('id', locationId)
      .single();

    if (error || !location) {
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
    res.status(500).json({ success: false, message: error.message });
  }
};
