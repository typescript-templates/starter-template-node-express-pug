import { HomeController } from "../controllers/HomeController";
import { AppRouter } from "@typescript-templates/node-server";
import { Request, Response, NextFunction } from "express";


export class HomeRouter extends AppRouter {
  readonly controller: HomeController;

  constructor(controller: HomeController) {
    super("HomeRouter");
    this.controller = controller;
  }

  initialize(): void {
    /**
     * Public routes.
     */
    this.use(this.userToLocals);

    // Home
    this.addRoute("get", "/", this.controller.index);

    /**
     * Restricted routes.
     */

  }

  private userToLocals = (req: Request, res: Response, next: NextFunction): void => {
    res.locals.user = req.user;
    next();
  };

}
