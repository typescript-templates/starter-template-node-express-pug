import { IRouter } from "express";

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IAppRouter {
  readonly url: string;
  parentUrl?: string;
  Router: IRouter;
  initialize(): void;
  initializeSubRouter(): void;
  getUrl(): string;
  subRouter?: IAppRouter[];
}
