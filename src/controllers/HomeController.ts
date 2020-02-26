import { Request, Response } from "express";

export class HomeController {
  static index = (req: Request, res: Response): void => {
    res.render("home", {
      title: "Home"
    });
  };
}
