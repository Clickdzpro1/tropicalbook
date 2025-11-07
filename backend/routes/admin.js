const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getUsers,
  getAnalytics,
  getRevenue,
  createPromoCode,
  getAuditLogs,
  manageBookings,
  manageReviews
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.get('/analytics', getAnalytics);
router.get('/revenue', getRevenue);
router.post('/promo-codes', createPromoCode);
router.get('/audit-logs', getAuditLogs);
router.get('/bookings', manageBookings);
router.get('/reviews', manageReviews);

module.exports = router;