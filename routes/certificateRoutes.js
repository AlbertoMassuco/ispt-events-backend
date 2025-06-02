const express = require('express');
const router = express.Router();
const {
  getUserCertificates,
  generateCertificate,
  verifyCertificate,
  downloadCertificate
} = require('../controllers/certificateController');
const { protect, admin } = require('../middlewares/auth');

router.get('/', protect, getUserCertificates);
router.get('/verify/:certificateCode', verifyCertificate);
router.get('/download/:id', protect, downloadCertificate);

// Admin routes
router.post('/generate/:registrationId', protect, admin, generateCertificate);

module.exports = router;