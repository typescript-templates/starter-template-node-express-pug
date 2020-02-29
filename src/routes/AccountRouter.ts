import * as passportConfig from "../utils/passport";
import { Request, Response, NextFunction } from "express-serve-static-core";
import { AccountController } from "../features/account/accountController";
import { AppRouter } from "@typescript-templates/node-server";
import { IAppRouter } from "@typescript-templates/node-server";

export class AccountRoutes extends AppRouter {

  constructor(...subRouter: IAppRouter[]) {
    super("AccountRoutes", "/account");
    this.subRouter = subRouter || [];
  }

  initialize(): void {
    console.log(`Initializing routes (${this.url})`);

    const accountController = new AccountController();
    // Each router musst use its own security context.
    // To not affect sub routes, add them first
    this.initializeSubRouter();

    this.use(this.testRedirect);

    /**
     * Public access
     */
    this.addRoute("get", "/signup", accountController.getSignup);
    this.addRoute("post", "/signup", accountController.postSignup);

    this.addRoute("get", "/forgot", accountController.getForgot);
    this.addRoute("post", "/forgot", accountController.postForgot);
    this.addRoute("get", "/reset/:token", accountController.getReset);
    this.addRoute("post", "/reset/:token", accountController.postReset);

    /**
     * Restricted access
     */
    this.use(passportConfig.isAuthenticated);

    this.addRoute("get", "/", accountController.getAccount);
    this.addRoute("get", "/unlink/:provider", accountController.getOauthUnlink);

    this.addRoute("post", "/profile", accountController.postUpdateProfile);
    this.addRoute("post", "/password", accountController.postUpdatePassword);
    this.addRoute("post", "/delete", accountController.postDeleteAccount);

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
