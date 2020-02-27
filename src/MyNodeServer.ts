import AppConfig from "./config/AppConfig";
import express, { Express } from "express";
import session from "express-session";
import path from "path";
import passport from "passport";
import { MongoDb } from "dotup-ts-mongoose";
import mongo, { MongoUrlOptions, MongooseConnectionOptions, NativeMongoOptions, MongoStore, NativeMongoPromiseOptions } from "connect-mongo";
import { NodeServer } from "./features/NodeServer/NodeServer";


/**
 * TODO:
 * -TypeORM: https://entwickler.de/online/javascript/typescript-server-579826585.html
 * -Swagger: https://medium.com/@sean_bradley/add-swagger-ui-to-existing-nodejs-typescript-api-882ca7aded90
 * -Restify: http://restify.com/docs/client-guide/
 */

export class MyNodeServer extends NodeServer {
  private db: MongoDb;

  async initialize(app: Express): Promise<void> {

    super.initialize(
      app,

      () => this.CreateMongoStore({
        url: AppConfig.MONGODB_URI,
        autoReconnect: true
      }),
      AppConfig.SESSION_SECRET
    );

    this.db = new MongoDb();
    await this.db.Connect(AppConfig.MONGODB_URI, AppConfig.MONGODB_DB_NAME, {
      useFindAndModify: false
    });

    // Express configuration
    app.set("views", path.join(__dirname, "../views"));
    app.set("view engine", "pug");

    app.use(passport.initialize());
    app.use(passport.session());

    // Static files
    app.use(
      express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
    );

  }

  CreateMongoStore(options: MongoUrlOptions | MongooseConnectionOptions | NativeMongoOptions | NativeMongoPromiseOptions): MongoStore {
    const factory = mongo(session);
    return new factory(options);
  }

}
