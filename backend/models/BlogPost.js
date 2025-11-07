const { supabase } = require('../config/supabase');

class BlogPost {
  static generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  static async create(postData) {
    const slug = postData.slug || this.generateSlug(postData.title);

    const dataToInsert = {
      ...postData,
      slug,
      status: postData.status || 'draft'
    };

    if (postData.status === 'published' && !postData.published_at) {
      dataToInsert.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, users(first_name, last_name, email)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async findBySlug(slug) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, users(first_name, last_name)')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      await this.incrementViews(data.id);
    }

    return data;
  }

  static async findAll(filters = {}) {
    let query = supabase
      .from('blog_posts')
      .select('*, users(first_name, last_name)');

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.authorId) {
      query = query.eq('author_id', filters.authorId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getPublished(limit = 10) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, users(first_name, last_name)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  static async update(id, updates) {
    if (updates.status === 'published' && !updates.published_at) {
      updates.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async incrementViews(id) {
    const post = await this.findById(id);
    if (!post) return;

    return await supabase
      .from('blog_posts')
      .update({ views: post.views + 1 })
      .eq('id', id);
  }

  static async delete(id) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = BlogPost;
