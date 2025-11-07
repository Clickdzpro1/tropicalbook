const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/:id', getBooking);
router.put('/:id', updateBooking);
router.delete('/:id', cancelBooking);

module.exports = router;