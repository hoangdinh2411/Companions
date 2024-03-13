import nodemailer from 'nodemailer';
import env from './env';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: env.SEND_EMAIL_SERVICE,
  auth: {
    user: env.SEND_EMAIL_USER,
    pass: env.SEND_EMAIL_PASSWORD,
  },
});

const sendVerifyEmail = async (to: string, verify_link: string) => {
  const content = `
  <h1>Verify Your Email</h1>
  <p>Click the link below to verify your email</p>
  <a href="${verify_link}">Verify Email</a>
  
  `;
  const mailOptions = {
    from: env.SEND_EMAIL_USER,
    to,
    subject: 'Account Verification ',
    html: content,
  };

  return await transporter.sendMail(mailOptions);
};

export { sendVerifyEmail };
