const Certificate = require('../models/Certificate');
const Registration = require('../models/Registration');
const { generateCertificate } = require('../utils/certificateGenerator');

// @desc    Get user certificates
// @route   GET /api/certificates
// @access  Private
exports.getUserCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ 'registration.user': req.user.id })
      .populate({
        path: 'registration',
        populate: {
          path: 'event',
          select: 'title description startDate endDate'
        }
      });
    
    res.json({ success: true, count: certificates.length, data: certificates });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate certificate
// @route   POST /api/certificates/generate/:registrationId
// @access  Private/Admin
exports.generateCertificate = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.registrationId)
      .populate('user', 'name')
      .populate('event', 'title startDate endDate');
    
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Inscrição não encontrada' });
    }
    
    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({ registration: registration._id });
    if (existingCertificate) {
      return res.status(400).json({ success: false, message: 'Certificado já gerado para esta inscrição' });
    }
    
    // Generate certificate code
    const certificateCode = `ISPT-${registration.event.title.substring(0, 3).toUpperCase()}-${Date.now()}`;
    
    // Generate PDF certificate
    const filePath = await generateCertificate({
      userName: registration.user.name,
      eventTitle: registration.event.title,
      eventDate: registration.event.startDate,
      certificateCode,
      hours: 8 // Default hours for now
    });
    
    // Create certificate record
    const certificate = await Certificate.create({
      registration: registration._id,
      certificateCode,
      filePath
    });
    
    // Update registration as attended
    registration.attended = true;
    await registration.save();
    
    res.status(201).json({ success: true, data: certificate });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify certificate
// @route   GET /api/certificates/verify/:certificateCode
// @access  Public
exports.verifyCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({ certificateCode: req.params.certificateCode })
      .populate({
        path: 'registration',
        populate: [
          { path: 'user', select: 'name' },
          { path: 'event', select: 'title startDate endDate' }
        ]
      });
    
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificado não encontrado' });
    }
    
    res.json({ success: true, data: certificate });
  } catch (err) {
    next(err);
  }
};

// @desc    Download certificate
// @route   GET /api/certificates/download/:id
// @access  Private
exports.downloadCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('registration');
    
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificado não encontrado' });
    }
    
    // Check if user owns the certificate
    if (certificate.registration.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Não autorizado' });
    }
    
    res.download(certificate.filePath);
  } catch (err) {
    next(err);
  }
};