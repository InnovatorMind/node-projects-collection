import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const info = await transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: process.env.EMAIL_TO,
  subject: "Hello World",
  html: `<h2 style="color: orange;">Hello world from Amarjeet's side?</h2>`,
});

console.log("✅ Email sent:", info.messageId);
