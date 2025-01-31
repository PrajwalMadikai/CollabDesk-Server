import { NextFunction, Request, Response } from "express-serve-static-core";
import { AdminUsecase } from "../../applications/usecases/AdminUsecase";
export class AdminController{
    constructor(
        private adminUsecase:AdminUsecase
    ){}
   async findAdmin(req:Request,res:Response,next:NextFunction)
   {
    try {
           const {email,password}=req.body
           const admin=await this.adminUsecase.verfyAdmin(email,password)

           return res.status(admin.status).json({
            message: admin.message,
            admin: admin.admin,
            accessToken:admin.accessToken
        });
    } catch (error:any) {
        console.log(error);
        
    }
   }
}