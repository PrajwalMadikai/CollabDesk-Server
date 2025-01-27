import { NextFunction, Request, Response } from "express";
import { GoogleAuthUsecase } from "../../applications/usecases/GoogleUsecase";
import { UserUsecase } from "../../applications/usecases/UserUsecase";

export class LoginController{
    constructor(
        private userUsecase:UserUsecase,
        private googleUseCase:GoogleAuthUsecase     
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
    
}