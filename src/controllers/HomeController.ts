import { Request, Response, NextFunction } from "express";

export class HomeController {
  index = (req: Request, res: Response, next: NextFunction): void => {
    return next(new Error())
    res.render("home", {
      title: "Home"
    });
  };
}
