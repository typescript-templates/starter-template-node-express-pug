/*
 * File generated by Interface generator (dotup.dotup-vscode-interface-generator)
 * Date: 2020-02-29 06:48:17 
*/
import { Request, Response, NextFunction } from "express";

export interface IAccountController {
    /**
     * Login page.
     */
    getLogin: (req: Request, res: Response) => void;
    /**
     * Sign in using email and password.
     */
    postLogin: (req: Request, res: Response, next: NextFunction) => any;
    /**
     * Log out.
     */
    logout: (req: Request, res: Response) => void;
    /**
     * Profile page.
     */
    getAccount: (req: Request, res: Response) => void;
    /**
     * Update profile information.
     */
    postUpdateProfile: (req: Request, res: Response, next: NextFunction) => any;
    /**
     * Update current password.
     */
    postUpdatePassword: (req: Request, res: Response, next: NextFunction) => any;
    /**
     * Delete user account.
     */
    postDeleteAccount: (req: Request, res: Response, next: NextFunction) => any;
    /**
     * Unlink OAuth provider.
     */
    getOauthUnlink: (req: Request, res: Response, next: NextFunction) => any;
    /**
     * Reset Password page.
     */
    getReset: (req: Request, res: Response, next: NextFunction) => any;
    /**
     * Process the reset password request.
     */
    postReset: (req: Request, res: Response, next: NextFunction) => any;
    /**
     * Forgot Password page.
     */
    getForgot: (req: Request, res: Response) => void;
    /**
     * Create a random token, then the send user an email with a reset link.
     */
    postForgot: (req: Request, res: Response, next: NextFunction) => any;
    /**
     * Signup page.
     */
    getSignup: (req: Request, res: Response) => void;
    /**
     * Create a new local account.
     */
    postSignup: (req: Request, res: Response, next: NextFunction) => any;
}
