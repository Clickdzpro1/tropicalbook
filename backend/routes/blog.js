const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');

router.get('/posts', getPosts);
router.get('/posts/:slug', getPost);

// Admin routes
router.post('/posts', protect, authorize('admin'), createPost);
router.put('/posts/:id', protect, authorize('admin'), updatePost);
router.delete('/posts/:id', protect, authorize('admin'), deletePost);

module.exports = router;