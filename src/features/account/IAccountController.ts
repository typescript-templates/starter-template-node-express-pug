/*
 * File generated by Interface generator (dotup.dotup-vscode-interface-generator)
 * Date: 2020-02-29 06:48:17 
*/
import { Request, Response, NextFunction, ParamsDictionary } from "express-serve-static-core";

export interface IAccountController {
    /**
     * Login page.
     */
    getLogin: (req: Request<ParamsDictionary, any, any>, res: Response<any>) => void;
    /**
     * Sign in using email and password.
     */
    postLogin: (req: Request<ParamsDictionary, any, any>, res: Response<any>, next: NextFunction) => any;
    /**
     * Log out.
     */
    logout: (req: Request<ParamsDictionary, any, any>, res: Response<any>) => void;
    /**
     * Profile page.
     */
    getAccount: (req: Request<ParamsDictionary, any, any>, res: Response<any>) => void;
    /**
     * Update profile information.
     */
    postUpdateProfile: (req: Request<ParamsDictionary, any, any>, res: Response<any>, next: NextFunction) => any;
    /**
     * Update current password.
     */
    postUpdatePassword: (req: Request<ParamsDictionary, any, any>, res: Response<any>, next: NextFunction) => any;
    /**
     * Delete user account.
     */
    postDeleteAccount: (req: Request<ParamsDictionary, any, any>, res: Response<any>, next: NextFunction) => any;
    /**
     * Unlink OAuth provider.
     */
    getOauthUnlink: (req: Request<ParamsDictionary, any, any>, res: Response<any>, next: NextFunction) => any;
    /**
     * Reset Password page.
     */
    getReset: (req: Request<ParamsDictionary, any, any>, res: Response<any>, next: NextFunction) => any;
    /**
     * Process the reset password request.
     */
    postReset: (req: Request<ParamsDictionary, any, any>, res: Response<any>, next: NextFunction) => any;
    /**
     * Forgot Password page.
     */
    getForgot: (req: Request<ParamsDictionary, any, any>, res: Response<any>) => void;
    /**
     * Create a random token, then the send user an email with a reset link.
     */
    postForgot: (req: Request<ParamsDictionary, any, any>, res: Response<any>, next: NextFunction) => any;
    /**
     * Signup page.
     */
    getSignup: (req: Request<ParamsDictionary, any, any>, res: Response<any>) => void;
    /**
     * Create a new local account.
     */
    postSignup: (req: Request<ParamsDictionary, any, any>, res: Response<any>, next: NextFunction) => any;
}
