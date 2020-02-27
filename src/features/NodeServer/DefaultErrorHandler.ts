import { HttpStatusCode } from "./HttpStatusCodes";
import { Request, Response } from "express-serve-static-core";
import { NextFunction } from "express";

export const DefaultErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send("Internal server error");
};