/* eslint-disable @typescript-eslint/no-unused-vars */
import { IAppRouter } from "./IAppRouter";
import { IRouter, RequestHandler, Router as ExpressRouter } from "express";
import { RouterError } from "./RouterError";
import { HttpVerbs } from "./HttpVerbs";

export class AppRouter implements IAppRouter {
  readonly ControllerName: string;
  readonly url: string;
  parentUrl: string;
  Router: IRouter;
  subRouter: IAppRouter[];

  constructor(name: string, url?: string) {
    this.ControllerName = name;
    this.url = url || "";
    this.parentUrl = "";
    this.Router = ExpressRouter();
    this.subRouter = [];
  }

  initialize(): void {
    throw RouterError.RouterNotInitialized();
  }

  initializeSubRouter(): void {
    for (const item of this.subRouter) {
      item.parentUrl = this.url;
      item.initialize();
      this.Router.use(item.Router);
    }
  }

  addRoute(method: HttpVerbs, url: string, ...requestHandler: RequestHandler[]): void {
    console.log(`${this.ControllerName} added ${method.toUpperCase()} ${this.parentUrl}${this.url}${url}`);
    this.Router[method](url.trim(), ...requestHandler);
  }

  use(...requestHandler: RequestHandler[]): void {
    this.Router.use(...requestHandler);
  }

  getUrl(): string {
    return this.url;
  }
}