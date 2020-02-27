import express from "express";

import AppConfig from "./config/AppConfig";
import { MyNodeServer } from "./MyNodeServer";
import { AppRoutes } from "./routes/AppRoutes";

process.on("unhandledRejection", (error: any) => {
  // Will print "unhandledRejection err is not defined"
  console.log("unhandledRejection", error.message);
});

// Create app and start
async function StartServer(): Promise<void> {
  const server = new MyNodeServer();
  await server.initialize(express())
  server.assignRoutes(AppRoutes);
  server.start(AppConfig.PORT);
}

StartServer();
