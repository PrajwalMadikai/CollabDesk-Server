import { NextFunction, Request, Response } from "express";
import { GithubUsecase } from "../../applications/usecases/GithubUsecase";
import { GoogleAuthUsecase } from "../../applications/usecases/GoogleUsecase";
import { UserUsecase } from "../../applications/usecases/UserUsecase";

export class LoginController{
    constructor(
        private userUsecase:UserUsecase,
        private googleUseCase:GoogleAuthUsecase,     
        private githubUsecase:GithubUsecase
            ){}

    async registerUser(req:Request,res:Response,next:NextFunction)
    {
        try {
            const { email, password, fullName, workSpaces, paymentDetail } = req.body;

            let googleId=undefined
            let avatar=undefined
            const result = await this.userUsecase.registerUser(
                email,
                password,
                fullName,
                workSpaces,
                paymentDetail,
                googleId,
                avatar
            );

            res.status(201).json(result);

        } catch (error:any) {
            console.log(error.message);
            
            res.status(400).json({ message: error.message });
            next(error)
        }
    }
    async verifyEmail(req: Request, res: Response,next:NextFunction) {
        try {
          
          const { email, token } = req.body
      
      
          if (!email || !token) {
            throw new Error('Missing email or token');
          }
      
          const result = await this.userUsecase.verifyEmail(email as string, token as string);
          res.status(200).json(result);
        } catch (error: any) {
          console.log('verify', error.message);
          res.status(400).json({ message: error.message });
          next(error)
        }
      }
      async googleSignUp(req: Request, res: Response, next: NextFunction) {
        try {
            const { idToken } = req.body;
            if (!idToken) {
                return res.status(400).json({ message: "Google ID token is required" });
            }
            const user = await this.googleUseCase.execute(idToken);
            return res.status(201).json({ message: "Google user created", user });
        } catch (error: any) {
            console.error(error.message);
            res.status(500).json({ message: "Google sign-up failed", error: error.message });
            next(error);
        }
    }
    async gitHubAuth(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.query.code) {
                const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
                const redirectUri = `http://localhost:5713/auth/github/callback`;
                return res.redirect(
                    `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`
                );
            }
    
            const { code } = req.query;
    
            if (typeof code !== "string") {
                return res.status(400).json({ error: "Invalid code format." });
            }
    
            const user = await this.githubUsecase.handlegithubAuth(code);
    
            // Redirect to frontend with encoded user data
            const FRONTEND_URL = 'http://localhost:3000'; // Update this to match your Next.js frontend URL
            return res.redirect(
                `${FRONTEND_URL}/auth/github/callback?data=${encodeURIComponent(
                    JSON.stringify(user)
                )}`
            );
    
        } catch (error: any) {
            console.error("GitHub Auth Error:", error.message);
            next(error)
        }
    }
    
}