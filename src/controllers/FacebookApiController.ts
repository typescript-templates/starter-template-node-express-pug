import graph from "fbgraph";
import { Response, Request, NextFunction } from "express";
import { AccountModel } from "../features/account/AccountModel";

export class FacebookApiController {
  /**
   * List of API examples.
   */
  static getApi = (req: Request, res: Response): void => {
    res.render("api/index", {
      title: "API Examples"
    });
  };

  /**
   * Facebook API example.
   */
  static getFacebook = (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as AccountModel;
    const account = user.linkedAccounts?.find(account => account.authProvider === "facebook");
    graph.setAccessToken(account?.token);
    graph.get(`${account?.id}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`, (err: Error, results: graph.FacebookUser) => {
      if (err) { return next(err); }
      res.render("api/facebook", {
        title: "Facebook API",
        profile: results
      });
    });
  };
}