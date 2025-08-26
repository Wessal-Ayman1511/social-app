import nodemailer from 'nodemailer'
import { EventEmitter } from 'events'




export const sendEmailEvent = new EventEmitter()

sendEmailEvent.on('sendEmail', async(email, otp)=> {

  const isSent = await sendEmail({
    to: email,
    subject: "verify email",
    html: `Your OTP is <b>${otp}<b/>`,
  });
    if (!isSent) {
    return next(new Error("Email not sent", { cause: 500 }));
  }
})

export const sendEmail = async ({to, subject, html}) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })

    const info = await transporter.sendMail({
        from: `"social-app"<${process.env.EMAIL}>`,
        to,
        subject,
        html
    })

    if(info.rejected.length > 0) return false;
    return true
}