const express = require('express');
const router = express.Router();
const {
  getLocations,
  getLocation,
  searchLocations,
  checkAvailability
} = require('../controllers/locationController');

router.get('/', getLocations);
router.get('/search', searchLocations);
router.get('/availability', checkAvailability);
router.get('/:id', getLocation);

module.exports = router;