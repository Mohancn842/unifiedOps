const nodemailer = require('nodemailer');

const sendOtpEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"UnifiedOps" <noreply@unifiedops.com>',
    to,
    subject: 'Your OTP for Password Reset',
    html: `<p>Your OTP is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
