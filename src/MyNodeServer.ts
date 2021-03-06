import AppConfig from "./config/AppConfig";
import express, { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import path from "path";
import passport from "passport";
import { MongoDb } from "@dotup/dotup-ts-mongoose";
import { HttpStatusCode } from "@dotup/dotup-ts-types";
import mongo, { MongoUrlOptions, MongooseConnectionOptions, NativeMongoOptions, MongoStore, NativeMongoPromiseOptions } from "connect-mongo";
import { NodeServer, SessionStoreFactory, DefaultErrorHandler } from "@typescript-templates/node-server";
import flash from "express-flash";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send("Internal server error");
};

/**
 * TODO:
 * -TypeORM: https://entwickler.de/online/javascript/typescript-server-579826585.html
 * -Swagger: https://medium.com/@sean_bradley/add-swagger-ui-to-existing-nodejs-typescript-api-882ca7aded90
 * -Restify: http://restify.com/docs/client-guide/
 */

export class MyNodeServer extends NodeServer {
  private db: MongoDb;
  // async initialize(server: ServerMethods, sessionStoreFactory: SessionStoreFactory, sessionSecret: string): Promise<void> {

  async initialize(app: Express, sessionStoreFactory?: SessionStoreFactory, sessionSecret?: string): Promise<void> {
    const sessionStore = this.CreateMongoStore({
      url: AppConfig.MONGODB_URI,
      autoReconnect: true
    });

    this.db = new MongoDb();
    await this.db.Connect(AppConfig.MONGODB_URI, AppConfig.MONGODB_DB_NAME, {
      useFindAndModify: false
    });

    super.initialize(
      app,
      () => sessionStore,
      AppConfig.SESSION_SECRET
    );

    app.use(flash());

    // Express configuration
    app.set("views", path.join(__dirname, "../views"));
    app.set("view engine", "pug");

    app.use(passport.initialize());
    app.use(passport.session());

    // Static files
    app.use(
      express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
    );

    app.use(errorHandler);
  }

  CreateMongoStore(options: MongoUrlOptions | MongooseConnectionOptions | NativeMongoOptions | NativeMongoPromiseOptions): MongoStore {
    const factory = mongo(session);
    return new factory(options);
  }

}
