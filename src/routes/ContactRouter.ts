import { ContactController } from "../controllers/ContactController";
import { AppRouter } from "@typescript-templates/node-server";


export class ContactRouter extends AppRouter {
  readonly controller: ContactController;

  constructor(controller: ContactController) {
    super("ContactRouter");
    this.controller = controller;
  }

  initialize(): void {

    // Contact
    this.addRoute("get", "/contact", this.controller.getContact);
    this.addRoute("post", "/contact", this.controller.postContact);

    /**
     * Restricted routes.
     */

  }


}
