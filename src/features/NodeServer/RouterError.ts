import { CustomError } from "../../utils/CustomError";
import { ErrorCodes } from "../../utils/ErrorCodes";

export class RouterError extends CustomError {
  private constructor(message: string, code: ErrorCodes) {
    super(message, code);
    this.name = "RouterError";
  }

  static RouterNotInitialized(): RouterError {
    return new RouterError("You've to override initialize().", ErrorCodes.RouterNotInitialized);
  }
}