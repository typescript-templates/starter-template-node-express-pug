import passport from "passport";
import passportLocal from "passport-local";
import passportFacebook from "passport-facebook";
import { Request, Response, NextFunction } from "express-serve-static-core";
import { AuthProvider } from "../models/AuthProvider";
import { AccountProfile } from "../models/AccountProfile";
import { LinkedAccount } from "../models/LinkedAccount";
import { EnumTools } from "./EnumTools";
import AppConfig from "../config/AppConfig";
import { UserEntity } from "../features/account/AccountEntity";
import { AccountModel } from "../features/account/AccountModel";
import AccountService from "../features/account/AccountService";

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
  UserEntity.findById(id, (err, user) => {
    done(err, user);
  });
});


/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, async (email: string, password: string, done: Function) => {

  try {
    const user = await AccountService.Login(email, password);
    return done(undefined, user);

  } catch (error) {
    return done(undefined, false, { message: "Invalid email or password." });

  }

}));

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

const getUserProfile = (profile: passportFacebook.Profile): AccountProfile => {
  return {
    gender: profile.gender,
    name: `${profile?.name?.givenName} ${profile?.name?.familyName}`,
    picture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
    website: profile.profileUrl
  };
};

const getLinkedAccount = (profile: passportFacebook.Profile, accessToken: string): LinkedAccount => {
  return {
    authProvider: EnumTools.getValue(AuthProvider, profile.provider),
    id: profile.id,
    token: accessToken
  };
};

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
  clientID: AppConfig.FACEBOOK_ID,
  clientSecret: AppConfig.FACEBOOK_SECRET,
  callbackURL: "https://dotup-nb11.home-gateway.ml/auth/facebook/callback",
  profileFields: ["name", "email", "link", "locale", "timezone"],
  passReqToCallback: true
}, async (req: any, accessToken, refreshToken, profile, done) => {

  const linked = getLinkedAccount(profile, accessToken);
  const userProfile = getUserProfile(profile);
  let user = undefined;

  try {
    if (req.user) {
      // Link account to current user
      user = await AccountService.LinkAccount(req.user.id, linked, userProfile);
      req.flash("info", { msg: "Facebook account has been linked." });

    } else {
      // Sign in / sign up with facebook
      user = await AccountService.LoginLinkedAccount(profile._json.email, linked, userProfile);
    }

  } catch (error) {
    req.flash("errors", { msg: error.message });
  }
  done(undefined, user);

}));


/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

/**
 * Authorization Required middleware.
 */
export const isAuthorized = (req: Request, res: Response, next: NextFunction): void => {
  const provider = req.path.split("/").slice(-1)[0];

  const user = req.user as AccountModel;
  const toki = user.linkedAccounts?.find(x => x.authProvider === provider)?.token;
  if (toki) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};
