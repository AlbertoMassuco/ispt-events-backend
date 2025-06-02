const nodemailer = require('nodemailer');
const config = require('../config/config');

// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
exports.sendContactMessage = async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: config.email.service,
      auth: {
        user: config.email.user,
        pass: config.email.pass
      }
    });

    // Email options
    const mailOptions = {
      from: email,
      to: 'contato@ispt.ac.mz',
      subject: `ISPT Events: ${subject}`,
      text: `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`,
      html: `
        <h2>Nova mensagem de contato</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Assunto:</strong> ${subject}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.' 
    });
  } catch (err) {
    console.error('Error sending contact message:', err);
    
    // Fallback para quando o email não está configurado
    if (process.env.NODE_ENV === 'development') {
      console.log('Mensagem simulada (em desenvolvimento):', { name, email, subject, message });
      return res.json({ 
        success: true, 
        message: 'Mensagem recebida (modo desenvolvimento)' 
      });
    }
    
    next(err);
  }
};