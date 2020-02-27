import { AccountRoutes } from "./AccountRouter";
import { FacebookApiRoutes } from "./FacebookApiRoutes";
import { IAppRouter } from "../features/NodeServer/IAppRouter";
import { HomeRouter } from "./HomeRoutes";

export const AppRoutes: IAppRouter[] = [
  new HomeRouter(),
  new AccountRoutes(),
  new FacebookApiRoutes()
];