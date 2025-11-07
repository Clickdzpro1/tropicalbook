const { supabase } = require('../config/supabase');

class Booking {
  static async create(bookingData) {
    const days = Math.ceil((new Date(bookingData.check_out) - new Date(bookingData.check_in)) / (1000 * 60 * 60 * 24));
    const subtotal = bookingData.daily_rate * days;
    const tax = subtotal * 0.08;
    const total = subtotal - (bookingData.discount || 0) + tax;
    const loyaltyPoints = Math.floor(total / 10);

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        ...bookingData,
        total_days: days,
        subtotal,
        tax,
        total,
        loyalty_points_earned: loyaltyPoints
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, users(*), locations(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, locations(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async findByLocationId(locationId) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, users(*)')
      .eq('location_id', locationId)
      .order('check_in', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async findAll(filters = {}) {
    let query = supabase
      .from('bookings')
      .select('*, users(*), locations(*)');

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.paymentStatus) {
      query = query.eq('payment_status', filters.paymentStatus);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async update(id, updates) {
    const { data, error} = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async cancel(id, reason) {
    return await this.update(id, {
      status: 'cancelled',
      cancellation_reason: reason
    });
  }

  static async updatePaymentStatus(id, status, paymentId = null) {
    const updates = {
      payment_status: status
    };

    if (paymentId) {
      updates.stripe_payment_id = paymentId;
    }

    if (status === 'completed') {
      updates.paid_at = new Date().toISOString();
    }

    return await this.update(id, updates);
  }
}

module.exports = Booking;
