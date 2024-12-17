//testing de la api 
//node server/testEmail.js para testear

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'incidencias.cr.2024@gmail.com',
    pass: 'zfwx wgez hfwa xrwx',
  },
});

async function testEmail() {
  try {
    await transporter.sendMail({
      from: 'incidencias.cr.2024@gmail.com',
      to: 'brithanycarvajal04@gmail.com', 
      subject: 'Prueba de correo',
      text: 'Este es un correo de prueba.',
    });
    console.log('Correo enviado correctamente.');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
}

testEmail();
