module.exports = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_here',
    expiresIn: process.env.JWT_EXPIRE || '30d'
  },

  // Certificate Configuration
  certificate: {
    templatePath: process.env.CERTIFICATE_TEMPLATE || './assets/certificate-template.jpg',
    outputPath: './public/certificates/',
    defaultHours: 8
  },

  // Email Configuration (para funcionalidades futuras)
  email: {
    service: process.env.EMAIL_SERVICE || 'Gmail',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};