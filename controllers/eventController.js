const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { generateCertificate } = require('../utils/certificateGenerator');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort('-createdAt');
    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento não encontrado' });
    }
    
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = async (req, res, next) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user.id
    });
    
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento não encontrado' });
    }
    
    // Check if already registered
    const existingRegistration = await Registration.findOne({
      user: req.user.id,
      event: req.params.id
    });
    
    if (existingRegistration) {
      return res.status(400).json({ success: false, message: 'Você já está inscrito neste evento' });
    }
    
    // Create registration
    const registration = await Registration.create({
      user: req.user.id,
      event: req.params.id
    });
    
    res.status(201).json({ success: true, data: registration });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user registrations
// @route   GET /api/events/my-registrations
// @access  Private
exports.getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate('event', 'title description startDate endDate location');
    
    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (err) {
    next(err);
  }
};