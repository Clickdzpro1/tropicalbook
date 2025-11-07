const { supabase } = require('../config/supabase');

class Location {
  static async create(locationData) {
    const { data, error } = await supabase
      .from('locations')
      .insert([locationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async findByAirportCode(airportCode) {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('airport_code', airportCode.toUpperCase())
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  }

  static async findAll(filters = {}) {
    let query = supabase
      .from('locations')
      .select('*');

    if (filters.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }

    if (filters.airportCode) {
      query = query.eq('airport_code', filters.airportCode.toUpperCase());
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async update(id, updates) {
    const { data, error } = await supabase
      .from('locations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateCapacity(id, available) {
    return await this.update(id, { capacity_available: available });
  }

  static async delete(id) {
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = Location;
