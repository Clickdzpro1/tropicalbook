const supabase = require('../config/supabase');

const calculateBookingPricing = (checkIn, checkOut, dailyRate) => {
  const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  const subtotal = dailyRate * days;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const loyaltyPointsEarned = Math.floor(total / 10);

  return {
    totalDays: days,
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    loyaltyPointsEarned
  };
};

exports.createBooking = async (req, res) => {
  try {
    const { locationId, vehicle, checkIn, checkOut, dailyRate } = req.body;

    const { data: location, error: locError } = await supabase
      .from('locations')
      .select('capacity_available')
      .eq('id', locationId)
      .single();

    if (locError || !location || location.capacity_available <= 0) {
      return res.status(400).json({ success: false, message: 'Location unavailable' });
    }

    const pricing = calculateBookingPricing(checkIn, checkOut, dailyRate);

    const { data: booking, error: bookError } = await supabase
      .from('bookings')
      .insert([{
        user_id: req.user.id,
        location_id: locationId,
        vehicle: vehicle,
        check_in: checkIn,
        check_out: checkOut,
        daily_rate: dailyRate,
        total_days: pricing.totalDays,
        subtotal: pricing.subtotal,
        tax: pricing.tax,
        total: pricing.total,
        loyalty_points_earned: pricing.loyaltyPointsEarned,
        status: 'pending'
      }])
      .select()
      .single();

    if (bookError) {
      return res.status(500).json({ success: false, message: bookError.message });
    }

    const { error: updateError } = await supabase
      .from('locations')
      .update({ capacity_available: location.capacity_available - 1 })
      .eq('id', locationId);

    if (updateError) {
      console.error('Failed to update location capacity:', updateError);
    }

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        locations (
          name,
          airport_code,
          airport_name
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        locations (*)
      `)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { data: existingBooking, error: checkError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (checkError || !existingBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const { data: booking, error: updateError } = await supabase
      .from('bookings')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ success: false, message: updateError.message });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { data: booking, error: checkError } = await supabase
      .from('bookings')
      .select('*, locations(capacity_available)')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (checkError || !booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const { data: updatedBooking, error: cancelError } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancellation_reason: req.body.reason
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (cancelError) {
      return res.status(500).json({ success: false, message: cancelError.message });
    }

    const { error: restoreError } = await supabase
      .from('locations')
      .update({ capacity_available: booking.locations.capacity_available + 1 })
      .eq('id', booking.location_id);

    if (restoreError) {
      console.error('Failed to restore location capacity:', restoreError);
    }

    res.json({ success: true, message: 'Booking cancelled', booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};