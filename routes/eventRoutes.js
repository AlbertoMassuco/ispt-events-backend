const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  registerForEvent,
  getMyRegistrations
} = require('../controllers/eventController');
const { protect, admin } = require('../middlewares/auth');

router.get('/', getEvents);
router.get('/:id', getEvent);
router.get('/my-registrations', protect, getMyRegistrations);
router.post('/:id/register', protect, registerForEvent);

// Admin routes
router.post('/', protect, admin, createEvent);

module.exports = router;