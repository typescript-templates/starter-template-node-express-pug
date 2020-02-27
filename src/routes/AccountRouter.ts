import * as passportConfig from "../utils/passport";
import { Request, Response, NextFunction } from "express-serve-static-core";
import { AccountController } from "../features/account/AccountController";
import { AppRouter } from "../features/NodeServer/AppRouter";
import { IAppRouter } from "../features/NodeServer/IAppRouter";

export class AccountRoutes extends AppRouter {

  constructor(...subRouter: IAppRouter[]) {
    super("AccountRoutes", "/account");
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
    this.addRoute("get", "/signup", AccountController.getSignup);
    this.addRoute("post", "/signup", AccountController.postSignup);

    this.addRoute("get", "/forgot", AccountController.getForgot);
    this.addRoute("post", "/forgot", AccountController.postForgot);
    this.addRoute("get", "/reset/:token", AccountController.getReset);
    this.addRoute("post", "/reset/:token", AccountController.postReset);

    /**
     * Restricted access
     */
    this.use(passportConfig.isAuthenticated);

    this.addRoute("get", "/", AccountController.getAccount);
    this.addRoute("get", "/unlink/:provider", AccountController.getOauthUnlink);

    this.addRoute("post", "/profile", AccountController.postUpdateProfile);
    this.addRoute("post", "/password", AccountController.postUpdatePassword);
    this.addRoute("post", "/delete", AccountController.postDeleteAccount);

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
