import nodemailer from "nodemailer";
import { handleError } from "./handleError";

export const etherealMailer = async (code: string) => {
  const receiver = "anhtuan3683242@gmail.com";
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    tls: {
      ciphers: "SSLv3",
    },
    auth: {
      user: process.env.AUTH_USER_EMAIL, // generated ethereal user
      pass: process.env.AUTH_PASS_EMAIL, // generated ethereal password
    },
  });
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  const options = {
    from: process.env.AUTH_USER_EMAIL,
    to: receiver,
    subject: "New Voucher Generated",
    html: `<p>Hello ${receiver}! <br> Notify you that a voucher has 
        just been created: <b>${code}</b> `,
  };
  return transporter.sendMail(options, function (error, info) {
    if (error) {
      handleError(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
