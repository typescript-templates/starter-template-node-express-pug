import * as passportConfig from "../utils/passport";
import { FacebookApiController } from "../controllers/FaceBookApiController";
import { AppRouter } from "@typescript-templates/node-server";


export class FacebookApiRouter extends AppRouter {
  readonly controller: FacebookApiController;

  constructor(controller: FacebookApiController) {
    super("FacebookApiRouter", "/api");
    this.controller = controller;
  }

  initialize(): void {
    /**
     * Public routes.
     */

    this.addRoute("get", "/", this.controller.getApi);

    /**
     * Restricted routes.
     */
    this.use(passportConfig.isAuthenticated, passportConfig.isAuthorized);

    this.addRoute("get", "/facebook", passportConfig.isAuthenticated, passportConfig.isAuthorized, this.controller.getFacebook);
  }

}
