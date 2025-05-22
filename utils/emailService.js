const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendVideoEmail(recipientEmail, video) {
  const viewLink = `${process.env.APP_URL}/view/${video.shareableLink}?recipientEmail=${recipientEmail}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: `Video Message: ${video.title}`,
    html: `<p>Watch your video <a href="${viewLink}">here</a></p>`
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendVideoEmail };
