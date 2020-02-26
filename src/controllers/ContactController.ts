import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import AppConfig from "../config/AppConfig";
import { MailService } from "../services/MailService";

export class ContactController {
  /**
   * Contact form page.
   */
  static getContact = (req: Request, res: Response): void => {
    res.render("contact", {
      title: "Contact"
    });
  };

  /**
   * Send a contact form via Nodemailer.
   */
  static postContact = async (req: Request, res: Response): Promise<void> => {
    await check("name", "Name cannot be blank").not().isEmpty().run(req);
    await check("email", "Email is not valid").isEmail().run(req);
    await check("message", "Message cannot be blank").not().isEmpty().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("errors", errors.array());
      return res.redirect("/contact");
    }

    const mailOptions = {
      to: AppConfig.CONTACT_MAIL_ADDRESS,
      from: `${req.body.name} <${req.body.email}>`,
      subject: "Contact Form",
      text: req.body.message
    };

    try {
      await MailService.Send(mailOptions);
      req.flash("success", { msg: "Email has been sent successfully!" });
      res.redirect("/contact");

    } catch (error) {
      req.flash("errors", { msg: error.message });
      return res.redirect("/contact");
    }
  };
}