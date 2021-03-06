// import express from "express";
// import errorHandler from "errorhandler";

// import AppConfig from "./config/AppConfig";
// import { MyApp } from "./MyApp";
// import logger from "./utils/logger";
// import { Server } from "http";
// import { AppRoutes } from "./routes/AppRoutes";

// process.on("unhandledRejection", (error: any) => {
//   // Will print "unhandledRejection err is not defined"
//   console.log("unhandledRejection", error.message);
// });

// /**
//  * TODO:
//  * -TypeORM: https://entwickler.de/online/javascript/typescript-server-579826585.html
//  * -Swagger: https://medium.com/@sean_bradley/add-swagger-ui-to-existing-nodejs-typescript-api-882ca7aded90
//  * -Restify: http://restify.com/docs/client-guide/
//  */

// // Create Express server
// const app = express();

// async function StartServer(): Promise<Server> {

//   // Initialize app
//   const myApp = new MyApp();
//   await myApp.Initialize(app, AppRoutes);

//   // Error Handler. Provides full stack - remove for production
//   app.use(errorHandler());

//   // Start Express server.
//   const info = `App is running at http://localhost:${AppConfig.PORT} in ${app.get("env")} mode`;

//   console.log(info);
//   const server = app.listen(AppConfig.PORT, () => {
//     console.log();
//     console.log("  Press CTRL-C to stop\n");
//   });

//   return server;
// }

// const server = StartServer();

// export default app;
