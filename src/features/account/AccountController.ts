import { Request, Response, NextFunction } from "express-serve-static-core";
import { check, validationResult } from "express-validator";
import "../../utils/passport";
import { AccountProfile } from "../../models/AccountProfile";
import { AccountError } from "../../utils/AccountError";
import { ErrorCodes } from "../../utils/ErrorCodes";
import { MailService } from "../../services/MailService";
import passport = require("passport");
import { IVerifyOptions } from "passport-local";
import AppConfig from "../../config/AppConfig";
import { AccountModel } from "./AccountModel";
import AccountService from "./AccountService";

export class AccountController {
  /**
   * Login page.
   */
  static getLogin = (req: Request, res: Response): void => {
    if (req.user) {
      return res.redirect("/");
    }
    res.render("account/login", {
      title: "Login"
    });
  };

  /**
   * Sign in using email and password.
   */
  static postLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password cannot be blank").isLength({ min: 1 }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("errors", errors.array());
      return res.redirect("account/login");
    }

    passport.authenticate("local", (err: Error, user: AccountModel, info: IVerifyOptions) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash("errors", { msg: info.message });
        return res.redirect("/login");
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        req.flash("success", { msg: "Success! You are logged in." });
        res.redirect(req.session?.returnTo || "/");
      });
    })(req, res, next);
  };

  /**
   * Log out.
   */
  static logout = (req: Request, res: Response): void => {
    req.logout();
    res.redirect("/");
  };

  /**
   * Profile page.
   */
  static getAccount = (req: Request, res: Response): void => {
    res.render("account/profile", {
      title: "Account Management"
    });
  };

  /**
  * Update profile information.
  */
  static postUpdateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await check("email", "Please enter a valid email address.").isEmail().run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("errors", errors.array());
      return res.redirect("/account");
    }

    const reqUser = req.user as AccountModel;
    const profile = req.body as AccountProfile;

    try {
      await AccountService.UpdateProfile(reqUser.id!, { ...profile });

      req.flash("success", { msg: "Profile information has been updated." });
    }
    catch (error) {
      if (error.code === 11000) {
        req.flash("errors", { msg: "The email address you have entered is already associated with an account." });
      } else {
        next(error);
      }
    }
    finally {
      return res.redirect("/account");
    }
  };

  /**
   * Update current password.
   */
  static postUpdatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
    await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("errors", errors.array());
      return res.redirect("/account");
    }

    const reqUser = req.user as AccountModel;

    try {
      await AccountService.UpdatePassword(reqUser.id!, req.body.password);

      req.flash("success", { msg: "Password has been changed." });
      res.redirect("/account");

    } catch (error) {
      return next(error);
    }
  };

  /**
   * Delete user account.
   */
  static postDeleteAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as AccountModel;

    try {
      await AccountService.DeleteAccount(user.id!);

      req.logout();
      req.flash("info", { msg: "Your account has been deleted." });
      res.redirect("/");

    } catch (error) {
      return next(error);
    }
  };

  /**
   * Unlink OAuth provider.
   */
  static getOauthUnlink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const provider = req.params.provider;
    const reqUser = req.user as AccountModel;

    try {
      await AccountService.UnlinkOauth(reqUser.id!, provider);

      req.flash("info", { msg: `${provider} account has been unlinked.` });
      res.redirect("/account");

    } catch (error) {
      next(error);
    }

  };

  /**
   * Reset Password page.
   */
  static getReset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }

    try {
      const user = await AccountService.GetUserByPasswordResetToken(req.params.token);

      if (!user) {
        req.flash("errors", { msg: "Password reset token is invalid or has expired." });
        return res.redirect("/account/forgot");
      }

      res.render("account/reset", {
        title: "Password Reset"
      });

    } catch (error) {
      next(error);
    }
  };

  /**
   * Process the reset password request.
  */
  // TODO: Async

  static postReset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await check("password", "Password must be at least 4 characters long.").isLength({ min: 4 }).run(req);
    await check("confirm", "Passwords must match.").equals(req.body.password).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("errors", errors.array());
      return res.redirect("back");
    }

    try {
      const user = await AccountService.ResetPasswort(req.params.token, req.body.password);

      const mailOptions = {
        to: user.email,
        from: AppConfig.CONTACT_MAIL_ADDRESS,
        subject: "Your password has been changed",
        text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
      };

      await MailService.Send(mailOptions);

      req.flash("success", { msg: "Success! Your password has been changed." });
      res.redirect("/");
    } catch (error) {
      next(error);
    }

  };

  /**
   * Forgot Password page.
   */
  static getForgot = (req: Request, res: Response): void => {
    if (req.isAuthenticated()) {
      res.redirect("/");
    }
    res.render("account/forgot", {
      title: "Forgot Password"
    });
  };

  /**
   * Create a random token, then the send user an email with a reset link.
   */
  // TODO: async
  static postForgot = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await check("email", "Please enter a valid email address.").isEmail().run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("errors", errors.array());
      return res.redirect("/account/forgot");
    }

    try {
      await AccountService.PasswordResetRequest(req.headers.host!, req.body.email);

      req.flash("info", { msg: `An e-mail has been sent to ${req.body.email} with further instructions.` });
      res.redirect("/account/forgot");

    } catch (error) {
      if (error instanceof AccountError) {
        if (error.code === ErrorCodes.UserEmailNotFound) {
          req.flash("error", { msg: "Email address not found." });
        } else {
          next(error);
        }
      }
    }
  };

  /**
   * Signup page.
   */
  static getSignup = (req: Request, res: Response): void => {
    if (req.user) {
      res.redirect("/");
    } else {
      res.render("account/signup", {
        title: "Create Account"
      });
    }
  };

  /**
   * Create a new local account.
   */
  static postSignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
    await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("errors", errors.array());
      return res.redirect("/account/signup");
    }

    try {

      const user = await AccountService.CreateAccount(req.body.email, req.body.password);

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });

    } catch (error) {
      if (error instanceof AccountError) {
        if (error.code === ErrorCodes.EmailAlreadyUsed) {
          req.flash("errors", { msg: error.message });
          return res.redirect("/account/signup");
        } else {
          return next(error);
        }
      } else {
        return next(error);
      }
    }
  };

}