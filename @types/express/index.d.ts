import { AccountModel } from "../../src/features/account/AccountModel";

declare module "express-serve-static-core" {
  interface Request {
    user: AccountModel;
    token: any;
  }
}
