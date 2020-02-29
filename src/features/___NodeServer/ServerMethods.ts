// import { Server as HttpServer } from "http";
import { HttpVerbs } from "./HttpVerbs";
import { RequestHandler } from "express";

export type x = HttpVerbs & string;

export type IHttpController = IHttpControllerMethods;
export type IHttpServer = IHttpServerMethods & IHttpServerListner;

export type IHttpServerListner = {
  listen(port: number): void;
  // start(server: Application): void;
  listen(port: number, hostname: string, backlog: number, callback?: (...args: any[]) => void): void;
  listen(port: number, hostname: string, callback?: (...args: any[]) => void): void;
  listen(port: number, callback?: (...args: any[]) => void): void;
  listen(callback?: (...args: any[]) => void): void;
  listen(path: string, callback?: (...args: any[]) => void): void;
  listen(handle: any, listeningListener?: () => void): void;
};

export type IHttpControllerMethods = {
  [key in HttpVerbs]: (url: string, ...requestHandler: RequestHandler[]) => Promise<void>;
};

export type ServerMethods = {
  use(...args: any[]): void;
  listen(port: number, callback: () => void): void;
} & IHttpServerMethods;

export type ServerUseMethods = {
  (router: IHttpController): void;
  (): void;
};

export type IHttpServerMethods = {
  [key in HttpVerbs]: (url: string, ...requestHandler: RequestHandler[]) => any;
};
// } & {
//   get(url: string, requestHandler: RequestHandler): void;
//   post(url: string, requestHandler: number): void;
//   del(url: string, requestHandler: RequestHandler): void; 
//   put(url: string, requestHandler: RequestHandler): void;
// };
