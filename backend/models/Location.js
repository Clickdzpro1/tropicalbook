const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  airport: {
    code: {
      type: String,
      required: true,
      enum: ['FLL', 'YYZ']
    },
    name: {
      type: String,
      required: true
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  pricing: {
    daily: {
      type: Number,
      required: true
    },
    weekly: Number,
    monthly: Number
  },
  features: [{
    type: String,
    enum: ['covered', 'valet', 'shuttle', 'car_wash', 'ev_charging', '24_7_security', 'indoor']
  }],
  capacity: {
    total: {
      type: Number,
      required: true
    },
    available: {
      type: Number,
      required: true
    }
  },
  operatingHours: {
    open: String,
    close: String
  },
  images: [{
    url: String,
    caption: String
  }],
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Update availability
locationSchema.methods.updateAvailability = function(change) {
  this.capacity.available += change;
  if (this.capacity.available < 0) this.capacity.available = 0;
  if (this.capacity.available > this.capacity.total) this.capacity.available = this.capacity.total;
};

// Calculate rating
locationSchema.methods.calculateRating = async function() {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ location: this._id });
  
  if (reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating.average = (sum / reviews.length).toFixed(1);
    this.rating.count = reviews.length;
  }
  
  await this.save();
};

module.exports = mongoose.model('Location', locationSchema);