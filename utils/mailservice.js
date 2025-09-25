// mailService.js
const nodemailer = require("nodemailer");

async function sendMail({ to, subject, message, name }) {
  // 1. Create a test account automatically
  const testAccount = await nodemailer.createTestAccount();

  // 2. Create transporter using Ethereal SMTP
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  // 3. Define mail options
  const mailOptions = {
    from: `"SIH Test" <${testAccount.user}>`, // sender
    to,                                       // recipient (dynamic)
    subject,
    text: message,                            // plain text
    html: `<p>Hello ${name || "User"},</p><p>${message}</p>`
  };

  // 4. Send email
  const info = await transporter.sendMail(mailOptions);

  console.log("Mail sent! Preview URL:", nodemailer.getTestMessageUrl(info));
  return info;
}

module.exports = { sendMail };
