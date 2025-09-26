// mailservice.js
const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendMail({ to, subject, message, name }) {
  // 1. Create transporter with your real email provider
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use host/port if different SMTP
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS  // your app password
    }
  });

  // 2. Define mail options
  const mailOptions = {
    from: `"EduTrack" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: message,
    html: `
      <p>Hello ${name || "User"},</p>
      <p>${message}</p>
    `
  };

  // 3. Send email
  const info = await transporter.sendMail(mailOptions);
  console.log("✅ Mail sent:", info.messageId);
  return info;
}

module.exports = { sendMail };
