const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviews,
  updateReview,
  markHelpful
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/:locationId', getReviews);
router.put('/:id', protect, updateReview);
router.post('/:id/helpful', protect, markHelpful);

module.exports = router;