import { Request, Response, NextFunction } from "express-serve-static-core";

export interface IController {
  [key: string]: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
