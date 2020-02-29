import { AppRouter } from "@typescript-templates/node-server";
import passport = require("passport");


export class FacebookAuthRouter extends AppRouter {

  constructor() {
    super("FacebookAuthRouter");
  }

  initialize(): void {
    /**
     * Public routes.
     */

    // OAuth authentication routes. (Sign in)
    this.addRoute("get", "/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
    this.addRoute("get", "/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
      res.redirect(req.session?.returnTo || "/");
    });

    /**
     * Restricted routes.
     */

  }


}
