import nodemailer from "nodemailer";
import {handleError} from './handleError';

export const etherealMailer = async (code: string) => {
    const receiver = 'anhtuan3683242@gmail.com';
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        service: 'Gmail',
        auth: {
        user: 'phamvqcuong99@gmail.com', // generated ethereal user
        pass: 'Quoccuong_999', // generated ethereal password
        }
    });
    transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
        }
      });
    const options ={
        from: 'dorian.fay59@ethereal.email',
        to: receiver,
        subject: 'New Voucher Generated',
        html: `<p>Hello ${receiver}! <br> Notify you that a voucher has 
        just been created: <b>${code}</b> `
    }
    return transporter.sendMail(options, function (error, info){
        if (error) {
            handleError(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
    })

    
}