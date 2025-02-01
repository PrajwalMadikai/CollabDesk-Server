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
           
           res.cookie('adminRefreshToken',admin.refreshToken,
            {
                httpOnly:true,
                secure:process.env.NODE_ENV==="production",
                maxAge:30 * 24 * 60 * 60 * 1000,  
                sameSite:'strict'
            }
           )
           return res.status(admin.status).json({
            message: admin.message,
            admin: admin.admin,
            accessToken:admin.accessToken
        });
    } catch (error:any) {
        next(error)
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
   }
   async logoutAdmin(req:Request,res:Response,next:NextFunction){
    try {
        res.clearCookie('adminRefreshToken', {
            httpOnly: true,  
            secure: process.env.NODE_ENV === 'production',  
            sameSite: 'strict', 
          });

          return res.status(200).json({ message: 'Logged out successfully' });
        
    } catch (error) {
        next(error)
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
   }

   async getUsers(req:Request,res:Response,next:NextFunction)
   {
     try {

        let users=await this.adminUsecase.findAllUsers()

        if(!users)
        {
           return res.json(404).json({message:"Couldn't fetch users"})
        }

        return res.status(200).json({message:"User fetchedsuccessfully",users})
        
     } catch (error) {
        next(error)
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
     }
   }
}