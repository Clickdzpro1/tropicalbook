const BlogPost = require('../models/BlogPost');

exports.getPosts = async (req, res) => {
  try {
    const { category, limit = 10, page = 1 } = req.query;
    
    const query = { status: 'published' };
    if (category) query.category = category;

    const posts = await BlogPost.find(query)
      .populate('author', 'firstName lastName')
      .sort('-publishedAt')
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    const total = await BlogPost.countDocuments(query);

    res.json({
      success: true,
      count: posts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      posts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug })
      .populate('author', 'firstName lastName');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.views += 1;
    await post.save();

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const post = await BlogPost.create({
      ...req.body,
      author: req.user.id
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    Object.assign(post, req.body);
    await post.save();

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    await post.remove();
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};