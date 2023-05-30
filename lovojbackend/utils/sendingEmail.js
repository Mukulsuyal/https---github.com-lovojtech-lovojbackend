const nodemailer = require("nodemailer");

exports.sendingEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USERNAMEE,
        pass: process.env.PASS,
      },
  });

 const output = await transporter.sendMail({
    from: process.env.USERNAMEE,
    to,
    subject,
    text,
  });
};