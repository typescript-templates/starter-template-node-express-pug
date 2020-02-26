import nodemailer from "nodemailer";
import AppConfig from "../config/AppConfig";
import Mail from "nodemailer/lib/mailer";

export class MailService {

  static async Send(mail: Mail.Options): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: AppConfig.SENDGRID_USER,
        pass: AppConfig.SENDGRID_PASSWORD
      }
    });

    await transporter.sendMail(mail);
  }
}