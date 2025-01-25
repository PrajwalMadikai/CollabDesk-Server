import { Request, Response } from "express";
import { UserUsecase } from "../../applications/usecases/UserUsecase";

export class LoginController{
    constructor(private userUsecase:UserUsecase){}

    async registerUser(req:Request,res:Response)
    {
        try {
            const { email, password, fullname, workSpaces, paymentDetail } = req.body;

            const result = await this.userUsecase.registerUser(
                email,
                password,
                fullname,
                workSpaces,
                paymentDetail
            );

            res.status(201).json(result);

        } catch (error:any) {
            res.status(400).json({ message: error.message });
            
        }
    }
    async verifyEmail(req: Request, res: Response) {
        try {
            const { email, token } = req.query;
            const result = await this.userUsecase.verifyEmail(email as string, token as string);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}