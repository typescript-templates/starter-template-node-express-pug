import * as passportConfig from "../utils/passport";
import { Request, Response, NextFunction } from "express";
import { AccountController } from "../features/account/accountController";
import { AppRouter } from "@typescript-templates/node-server";
import { IAppRouter } from "@typescript-templates/node-server";

export class AccountRouter extends AppRouter {
  readonly controller: AccountController;

  constructor(controller: AccountController, ...subRouter: IAppRouter[]) {
    super("AccountRoutes", "/account");
    this.controller = controller;
    this.subRouter = subRouter || [];
  }

  initialize(): void {
    console.log(`Initializing routes (${this.url})`);

    // Each router musst use its own security context.
    // To not affect sub routes, add them first
    this.initializeSubRouter();

    this.use(this.testRedirect);

    /**
     * Public access
     */
    this.addRoute("get", "/signup", this.controller.getSignup);
    this.addRoute("post", "/signup", this.controller.postSignup);

    this.addRoute("get", "/forgot", this.controller.getForgot);
    this.addRoute("post", "/forgot", this.controller.postForgot);
    this.addRoute("get", "/reset/:token", this.controller.getReset);
    this.addRoute("post", "/reset/:token", this.controller.postReset);

    /**
     * Restricted access
     */
    this.use(passportConfig.isAuthenticated);

    this.addRoute("get", "/", this.controller.getAccount);
    this.addRoute("get", "/unlink/:provider", this.controller.getOauthUnlink);

    this.addRoute("post", "/profile", this.controller.postUpdateProfile);
    this.addRoute("post", "/password", this.controller.postUpdatePassword);
    this.addRoute("post", "/delete", this.controller.postDeleteAccount);

  }

  private testRedirect = (req: Request, res: Response, next: NextFunction): void => {
    // After successful login, redirect back to the intended page
    if (req.session === undefined) {
      console.log("req.session === undefined");
      return;
    }

    if (
      !req.user &&
      req.path !== "/login" &&
      req.path !== "/signup" &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {

      req.session.returnTo = req.path;

    } else if (
      req.user &&
      req.path == "/account") {

      req.session.returnTo = req.path;

    }
    next();
  };

}
