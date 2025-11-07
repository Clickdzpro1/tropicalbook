const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  vehicle: {
    make: String,
    model: String,
    year: Number,
    color: String,
    licensePlate: { type: String, required: true }
  },
  dates: {
    checkIn: {
      type: Date,
      required: true
    },
    checkOut: {
      type: Date,
      required: true
    }
  },
  pricing: {
    dailyRate: Number,
    totalDays: Number,
    subtotal: Number,
    discount: { type: Number, default: 0 },
    tax: Number,
    total: Number,
    promoCode: String
  },
  payment: {
    method: String,
    stripePaymentId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  cancellationReason: String,
  refundAmount: Number,
  loyaltyPointsEarned: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Calculate total price
bookingSchema.methods.calculateTotal = function() {
  const days = Math.ceil((this.dates.checkOut - this.dates.checkIn) / (1000 * 60 * 60 * 24));
  this.pricing.totalDays = days;
  this.pricing.subtotal = this.pricing.dailyRate * days;
  this.pricing.tax = this.pricing.subtotal * 0.08; // 8% tax
  this.pricing.total = this.pricing.subtotal - this.pricing.discount + this.pricing.tax;
  
  // Calculate loyalty points (1 point per $10 spent)
  this.loyaltyPointsEarned = Math.floor(this.pricing.total / 10);
};

// Pre-save hook
bookingSchema.pre('save', function(next) {
  if (this.isModified('dates') || this.isModified('pricing.dailyRate')) {
    this.calculateTotal();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);