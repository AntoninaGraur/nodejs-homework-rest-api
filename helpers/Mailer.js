import nodemailer from "nodemailer";
import dotenv from "dotenv";


dotenv.config();

const { MAIL_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
    host: "smtp.ukr.net",
    port: 567,
    secure: true,
    auth: {
        user: "graurtosia@gmail.com",
        pass: MAIL_PASSWORD,
    }
})