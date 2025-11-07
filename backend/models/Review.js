const { supabase } = require('../config/supabase');

class Review {
  static async create(reviewData) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, users(*), locations(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async findByLocationId(locationId, approved = true) {
    let query = supabase
      .from('reviews')
      .select('*, users(first_name, last_name)')
      .eq('location_id', locationId);

    if (approved) {
      query = query.eq('is_approved', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, locations(name, airport_code)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async findAll(filters = {}) {
    let query = supabase
      .from('reviews')
      .select('*, users(*), locations(*)');

    if (filters.isApproved !== undefined) {
      query = query.eq('is_approved', filters.isApproved);
    }

    if (filters.isVerified !== undefined) {
      query = query.eq('is_verified', filters.isVerified);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async update(id, updates) {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async approve(id) {
    return await this.update(id, { is_approved: true });
  }

  static async incrementHelpful(id) {
    const review = await this.findById(id);
    if (!review) throw new Error('Review not found');

    return await this.update(id, {
      helpful_count: review.helpful_count + 1
    });
  }

  static async delete(id) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = Review;
