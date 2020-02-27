import { HomeController } from "../controllers/HomeController";
import { ContactController } from "../controllers/ContactController";
import { AppRouter } from "../features/NodeServer/AppRouter";
import { AccountController } from "../features/account/AccountController";
import passport = require("passport");
import { Request, Response, NextFunction } from "express-serve-static-core";


export class HomeRouter extends AppRouter {

  constructor() {
    super("HomeRouter");
  }

  initialize(): void {
    /**
     * Public routes.
     */
    this.use(this.userToLocals);

    // Home
    this.addRoute("get", "/", HomeController.index);

    // Login
    this.addRoute("post", "/login", AccountController.postLogin);
    this.addRoute("get", "/login", AccountController.getLogin);
    this.addRoute("get", "/logout", AccountController.logout);

    // Contact
    this.addRoute("get", "/contact", ContactController.getContact);
    this.addRoute("post", "/contact", ContactController.postContact);

    // OAuth authentication routes. (Sign in)
    this.addRoute("get", "/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
    this.addRoute("get", "/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
      res.redirect(req.session?.returnTo || "/");
    });

    /**
     * Restricted routes.
     */

  }

  private userToLocals = (req: Request, res: Response, next: NextFunction): void => {
    res.locals.user = req.user;
    next();
  };

}
