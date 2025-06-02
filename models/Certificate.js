const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  registration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    required: true
  },
  certificateCode: {
    type: String,
    required: true,
    unique: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  filePath: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Certificate', CertificateSchema);