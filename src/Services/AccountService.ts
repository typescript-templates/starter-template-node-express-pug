import crypto from "crypto";
import "../utils/passport";
import { AccountModel } from "../models/AccountModel";
import { UserEntity } from "../entities/AccountEntity";
import { AccountProfile } from "../models/AccountProfile";
import { AsyncCallback } from "dotup-ts-types";
import nodemailer from "nodemailer";
import AppConfig from "../config/AppConfig";
import bcrypt from "bcrypt-nodejs";
import { AccountError } from "../utils/AccountError";
import { getHash } from "../utils/helper";
import { AuthProvider } from "../models/AuthProvider";
import { LinkedAccount } from "../models/LinkedAccount";

/**
 * TODO: Validation
 * 
 */
class AccountService {

  async GetUserById(id: string): Promise<AccountModel> {
    const result = await UserEntity.findById(id);
    return result;
  }

  async GetUserByPasswordResetToken(passwordResetToken: string): Promise<AccountModel> {
    const user = await UserEntity
      .findOne({ passwordResetToken: passwordResetToken })
      .where("passwordResetExpires").gt(Date.now())
      .exec();
    return user;
  }

  async Login(email: string, password: string): Promise<AccountModel> {
    try {
      const user = await UserEntity.findOne({ email: email.toLowerCase() });

      if (user) {
        const okay = await AsyncCallback(password, user.password, bcrypt.compare);
        return okay === true ? user : undefined;
      } else {
        return undefined;
      }

    } catch{
      return undefined;
    }
  }
  /**
   * POST /account/profile
   * Update profile information.
   */
  async  UpdateProfile(userId: string, profile: Partial<AccountProfile>): Promise<AccountModel> {

    const user = await UserEntity.findById(userId);

    user.profile.name = profile.name;
    user.profile.gender = profile.gender;
    user.profile.location = profile.location;
    user.profile.website = profile.website;
    await user.save();

    return user;
  }

  /**
   * POST /account/password
   * Update current password.
   */
  async UpdatePassword(userId: string, password: string): Promise<void> {
    const user = await UserEntity.findById(userId);
    user.password = await getHash(password);
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    await user.save();
  }

  /**
   * Delete user account.
   */
  async DeleteAccount(userId: string): Promise<void> {
    await UserEntity.remove({ _id: userId });
  }

  /**
   * Unlink OAuth provider.
   */
  async UnlinkOauth(userId: string, provider: string): Promise<void> {

    const user = await UserEntity.findById(userId);

    user.linkedAccounts = user.linkedAccounts.filter((account) => account.authProvider !== provider);
    await user.save();
  }

  /**
   * GET /reset/:token
   * Reset Password page.
   */
  async ResetPasswort(passwordResetToken: string, newPassword: string): Promise<AccountModel> {
    const user = await UserEntity
      .findOne({ passwordResetToken: passwordResetToken })
      .where("passwordResetExpires").gt(Date.now())
      .exec();

    if (user) {
      this.UpdatePassword(user._id, newPassword);
      return user;
    } else {
      throw AccountError.TokexExpired();
    }
  }

  /**
   * POST /forgot
   * Create a random token, then the send user an email with a reset link.
   */
  async PasswordResetRequest(host: string, email: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    // Find user
    const user = await UserEntity.findOne({ "email": email });

    if (user) {

      // Set passwort reset token
      const buffer = await AsyncCallback(16, crypto.randomBytes);
      const token = buffer.toString("hex");

      user.passwordResetToken = token;
      user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

      await user.save();
      await this.sendForgotPasswordEmail(host, token, user);

    } else {
      throw AccountError.EmailNotFound(email);
    }

  }

  private async sendForgotPasswordEmail(host: string, token: string, user: AccountModel): Promise<void> {

    const transporter = nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: AppConfig.SENDGRID_USER,
        pass: AppConfig.SENDGRID_PASSWORD
      }
    });

    const mailOptions = {
      to: user.email,
      from: AppConfig.CONTACT_MAIL_ADDRESS,
      subject: "Reset your password on Hackathon Starter",
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://${host}/reset/${token}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    const result = await AsyncCallback(mailOptions, transporter.sendMail);
    console.log(result);

  }

  /**
   * POST /signup
   * Create a new local account.
   */
  async CreateAccount(email: string, password: string): Promise<AccountModel> {

    await this.CanCreateAccount(email);

    const hash = await getHash(password);

    const user = await UserEntity.Create({
      email: email,
      password: hash,
      profile: {},
      linkedAccounts: []
    });

    await user.save();

    return user;
  }

  async LoginLinkedAccount(email: string, linkedAccount: LinkedAccount, profile: AccountProfile): Promise<AccountModel> {

    const linked = await this.GetLinkedAccount(linkedAccount.authProvider, linkedAccount.id);

    if (linked) {
      return linked;
    }

    await this.CanCreateAccount(linkedAccount);

    const user = await UserEntity.Create({
      email: email,
      password: undefined,
      profile: profile,
      linkedAccounts: [
        {
          authProvider: linkedAccount.authProvider,
          id: linkedAccount.id,
          token: linkedAccount.token
        }
      ]
    });

    await user.save();

    return user;
  }


  async GetLinkedAccount(authProvider: AuthProvider, id: string): Promise<AccountModel> {
    const result = await UserEntity.findOne({
      "linkedAccounts": { $elemMatch: { authProvider: authProvider, id: id } }
    });
    console.log(result);
    return result;
  }

  async LinkAccount(userId: string, linkedAccount: LinkedAccount, profile: AccountProfile): Promise<AccountModel> {
    const alreadyLinked = await UserEntity.findOne({
      "linkedAccounts": { $elemMatch: { id: linkedAccount.id } }
    });

    if (alreadyLinked) {
      throw AccountError.AlreadyLinked(linkedAccount.authProvider);
    }

    const user = await UserEntity.findById(userId);

    user.profile.name = user.profile.name || profile.name;
    user.profile.gender = user.profile.gender || profile.gender;
    user.profile.location = user.profile.location || profile.location;
    user.profile.website = user.profile.website || profile.website;

    const link = { ...linkedAccount };
    user.linkedAccounts.push(link);

    user.save();

    return user;
  }

  async CanCreateAccount(emailOrLinkedAccount: string | LinkedAccount): Promise<boolean> {
    let exists = undefined;

    if (typeof emailOrLinkedAccount === "string") {
      exists = await UserEntity.findOne({ email: emailOrLinkedAccount });
    } else {
      exists = await this.GetLinkedAccount(emailOrLinkedAccount.authProvider, emailOrLinkedAccount.id);
    }

    if (exists) {
      throw AccountError.EmailAlreadyUsed();
    }

    return true;
  }
}

export default new AccountService();