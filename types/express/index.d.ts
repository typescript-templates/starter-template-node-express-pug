import { AccountModel } from "../../src/features/account/AccountModel";

declare global {
  namespace Express {
    interface Request {
      user: AccountModel;
      token: any;
    }
  }
}