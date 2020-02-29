import AppConfig from "./config/AppConfig";
import express, { Express } from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import lusca from "lusca";
import flash from "express-flash";
import session from "express-session";
import path from "path";
import passport from "passport";
import { MongoDb } from "@dotup/dotup-ts-mongoose";
import mongo, { MongoUrlOptions, MongooseConnectionOptions, NativeMongoOptions, MongoStore, NativeMongoPromiseOptions } from "connect-mongo";
import { IAppRouter } from "@typescript-templates/node-server";

export class MyApp {
  private db: MongoDb;

  async Initialize(app: Express, routes: IAppRouter[]): Promise<void> {
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(flash());
    app.use(lusca.xframe("SAMEORIGIN"));
    app.use(lusca.xssProtection(true));


    this.db = new MongoDb();
    await this.db.Connect(AppConfig.MONGODB_URI, AppConfig.MONGODB_DB_NAME, {
      useFindAndModify: false
    });

    // Express configuration
    app.set("port", AppConfig.PORT || 3000);
    app.set("views", path.join(__dirname, "../views"));
    app.set("view engine", "pug");

    this.ConfigureSession(app);

    app.use(passport.initialize());
    app.use(passport.session());

    // Static files
    app.use(
      express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
    );

    // app routes.
    for (const route of routes) {
      route.initialize();
      if (route.url){
        app.use(route.url, route.Router);
      }else{
        app.use(route.Router);
      }
    }
  }

  ConfigureSession(ex: express.Express): void {
    ex.use(session({
      resave: true,
      saveUninitialized: true,
      secret: AppConfig.SESSION_SECRET,
      store: this.CreateMongoStore({
        url: AppConfig.MONGODB_URI,
        autoReconnect: true
      })
    }));
  }

  CreateMongoStore(options: MongoUrlOptions | MongooseConnectionOptions | NativeMongoOptions | NativeMongoPromiseOptions): MongoStore {
    const factory = mongo(session);
    return new factory(options);
  }

}
