import * as passportConfig from "../utils/passport";
import { FacebookApiController } from "../controllers/FaceBookApiController";
import { AppRouter } from "../features/NodeServer/AppRouter";


export class FacebookApiRoutes extends AppRouter {

  constructor() {
    super("FacebookApiRoutes", "/api");
  }

  initialize(): void {
    /**
     * Public routes.
     */

    this.addRoute("get", "/", FacebookApiController.getApi);

    /**
     * Restricted routes.
     */
    this.use(passportConfig.isAuthenticated, passportConfig.isAuthorized);

    this.addRoute("get", "/facebook", passportConfig.isAuthenticated, passportConfig.isAuthorized, FacebookApiController.getFacebook);
  }

}
