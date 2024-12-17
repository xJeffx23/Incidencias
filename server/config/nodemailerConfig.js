const nodemailer = require('nodemailer');

//modulo para envio de correos
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'incidencias.cr.2024@gmail.com', 
    pass: 'zfwx wgez hfwa xrwx', 
  },
});

module.exports = transporter;
