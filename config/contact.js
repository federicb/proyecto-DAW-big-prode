const nodemailer = require('nodemailer');

async function conex_mail(name, email, message){
    contentHTML = `
    <h3>Message received from ${email}</h3>
    <p>${message}</p>
  `;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const infoMail = await transporter.sendMail({
    from: email + ' <federicodaw@gmail.com>',
    to: 'federicodaw@gmail.com',
    subject: `Enviado por ${name}`,
    html: contentHTML
  });

  console.log('Messege send', infoMail.messageId);
}

module.exports = {conex_mail};