import express from "express";

import AppConfig from "./config/AppConfig";
import { MyNodeServer } from "./MyNodeServer";
import { AppRoutes } from "./routes/AppRoutes";
import { NodeServer, IAppRouter, StartServer } from "@typescript-templates/node-server";

type Constructor<T extends {} = {}> = new (...args: any[]) => T;

process.on("unhandledRejection", (error: any) => {
  // Will print "unhandledRejection err is not defined"
  console.log("unhandledRejection", error.message);
});

// Create app and start
StartServer(MyNodeServer, AppRoutes, AppConfig.PORT)
  .then(_ => console.log("Server started"))
  .catch(e => {
    console.log("Server start failed.");
    console.log(e);
  })
  ;
