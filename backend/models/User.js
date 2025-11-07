const { supabase } = require('../config/supabase');
const bcrypt = require('bcryptjs');

class User {
  static async create({ email, password, firstName, lastName, phone }) {
    const password_hash = await bcrypt.hash(password, 12);

    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: email.toLowerCase().trim(),
        password_hash,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        role: 'customer',
        loyalty_points: 0,
        loyalty_tier: 'bronze',
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async update(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateLoyaltyPoints(userId, points) {
    const user = await this.findById(userId);
    if (!user) throw new Error('User not found');

    const newPoints = user.loyalty_points + points;
    let newTier = user.loyalty_tier;

    if (newPoints >= 1000) {
      newTier = 'gold';
    } else if (newPoints >= 500) {
      newTier = 'silver';
    } else {
      newTier = 'bronze';
    }

    return await this.update(userId, {
      loyalty_points: newPoints,
      loyalty_tier: newTier
    });
  }

  static async setResetToken(email, token, expire) {
    const { data, error } = await supabase
      .from('users')
      .update({
        reset_password_token: token,
        reset_password_expire: expire
      })
      .eq('email', email.toLowerCase())
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByResetToken(token) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('reset_password_token', token)
      .gt('reset_password_expire', new Date().toISOString())
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async resetPassword(userId, newPassword) {
    const password_hash = await bcrypt.hash(newPassword, 12);

    const { data, error } = await supabase
      .from('users')
      .update({
        password_hash,
        reset_password_token: null,
        reset_password_expire: null
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

module.exports = User;
