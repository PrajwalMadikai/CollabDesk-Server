import { Request, Response } from "express";
import { UserUsecase } from "../../applications/usecases/UserUsecase";

export class LoginController{
    constructor(private userUsecase:UserUsecase){}

    async registerUser(req:Request,res:Response)
    {
        try {
            const { email, password, fullName, workSpaces, paymentDetail } = req.body;

            const result = await this.userUsecase.registerUser(
                email,
                password,
                fullName,
                workSpaces,
                paymentDetail
            );

            res.status(201).json(result);

        } catch (error:any) {
            console.log(error.message);
            
            res.status(400).json({ message: error.message });
            
        }
    }
    async verifyEmail(req: Request, res: Response) {
        try {
          
          const { email, token } = req.body
      
          console.log('INSIDE OF VERIFY EMAIL', email, token);  
      
          if (!email || !token) {
            throw new Error('Missing email or token');
          }
      
          const result = await this.userUsecase.verifyEmail(email as string, token as string);
          res.status(200).json(result);
        } catch (error: any) {
          console.log('verify', error.message);
          res.status(400).json({ message: error.message });
        }
      }
      
}