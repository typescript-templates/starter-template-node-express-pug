import { HomeController } from "../controllers/HomeController";
import { ContactController } from "../controllers/ContactController";
import { AppRouter } from "@typescript-templates/node-server";
import { AccountController } from "../features/account/AccountController";
import passport = require("passport");
import { Request, Response, NextFunction } from "express-serve-static-core";


export class LoginRouter extends AppRouter {
  readonly controller: AccountController;

  constructor(controller: AccountController) {
    super("LoginRouter");
    this.controller = controller;
  }

  initialize(): void {
    /**
     * Public routes.
     */

    // Login
    this.addRoute("post", "/login", this.controller.postLogin);
    this.addRoute("get", "/login", this.controller.getLogin);
    this.addRoute("get", "/logout", this.controller.logout);

    /**
     * Restricted routes.
     */

  }

  private userToLocals = (req: Request, res: Response, next: NextFunction): void => {
    res.locals.user = req.user;
    next();
  };

}
