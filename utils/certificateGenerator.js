const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateCertificate = async (data) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4'
    });
    
    const fileName = `certificate-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../public/certificates', fileName);
    const stream = fs.createWriteStream(filePath);
    
    doc.pipe(stream);
    
    // Certificate design
    doc.image(path.join(__dirname, '../assets/certificate-bg.jpg'), 0, 0, { width: 842 });
    
    // Title
    doc.fontSize(32)
      .text('CERTIFICADO DE PARTICIPAÇÃO', {
        align: 'center',
        underline: true,
        lineGap: 20
      });
    
    // Content
    doc.fontSize(20)
      .text(`Certificamos que ${data.userName} participou do evento`, {
        align: 'center',
        lineGap: 10
      });
    
    doc.fontSize(24)
      .text(`"${data.eventTitle}"`, {
        align: 'center',
        lineGap: 20
      });
    
    doc.fontSize(16)
      .text(`Realizado em ${data.eventDate.toLocaleDateString('pt-BR')} com carga horária de ${data.hours} horas`, {
        align: 'center',
        lineGap: 40
      });
    
    // Code
    doc.fontSize(12)
      .text(`Código do certificado: ${data.certificateCode}`, {
        align: 'center'
      });
    
    doc.end();
    
    stream.on('finish', () => resolve(`/public/certificates/${fileName}`));
    stream.on('error', reject);
  });
};