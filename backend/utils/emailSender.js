import nodemailer from 'nodemailer';

const sendEmail = async (toEmail, subject, text) => {

  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,  // Load from .env
      pass: process.env.EMAIL_PASS   // Load from .env
    },
    debug: true
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: toEmail,
    subject: subject,
    text: text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export { sendEmail };
