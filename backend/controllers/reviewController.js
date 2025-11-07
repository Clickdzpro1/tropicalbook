const Review = require('../models/Review');
const Location = require('../models/Location');

exports.createReview = async (req, res) => {
  try {
    const { locationId, bookingId, rating, title, comment } = req.body;

    const review = await Review.create({
      user: req.user.id,
      location: locationId,
      booking: bookingId,
      rating,
      title,
      comment,
      isVerified: !!bookingId,
      status: 'approved'
    });

    // Update location rating
    const location = await Location.findById(locationId);
    await location.calculateRating();

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      location: req.params.locationId,
      status: 'approved'
    })
      .populate('user', 'firstName lastName')
      .sort('-createdAt');

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    Object.assign(review, req.body);
    await review.save();

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.helpful.users.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Already marked as helpful' });
    }

    review.helpful.users.push(req.user.id);
    review.helpful.count += 1;
    await review.save();

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};