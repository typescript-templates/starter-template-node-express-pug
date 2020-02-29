import { AccountRouter } from "./AccountRouter";
import { FacebookApiRouter } from "./FacebookApiRouter";
import { IAppRouter } from "@typescript-templates/node-server";
import { HomeRouter } from "./HomeRouter";
import { HomeController } from "../controllers/HomeController";
import { AccountController } from "../features/account/accountController";
import { FacebookApiController } from "../controllers/FaceBookApiController";
import { LoginRouter } from "./LoginRouter";
import { ContactRouter } from "./ContactRouter";
import { ContactController } from "../controllers/ContactController";
import { FacebookAuthRouter } from "./FacebookAuthRouter";

const accountController = new AccountController();

export const AppRoutes: IAppRouter[] = [
  new HomeRouter(new HomeController()),
  new LoginRouter(accountController),
  new ContactRouter(new ContactController()),
  new FacebookAuthRouter(),
  new AccountRouter(accountController),
  new FacebookApiRouter(new FacebookApiController())
];