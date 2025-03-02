import { NextFunction, Request, Response } from "express-serve-static-core";
import { AdminUsecase } from "../../applications/usecases/AdminUsecase";
export class AdminController{
    constructor(
        private adminUsecase:AdminUsecase
    ){}
    async findAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const admin = await this.adminUsecase.verfyAdmin(email, password);
            
            if (admin.refreshToken) {
                res.cookie('adminRefreshToken', admin.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 30 * 24 * 60 * 60 * 1000,   
                    sameSite: process.env.NODE_ENV === "production" ? 'strict' : 'lax'
                });
    
                return res.status(200).json({
                    message: "Login successful",
                    admin: admin.admin,
                    accessToken: admin.accessToken
                });
            }
    
            return res.status(401).json({ message: "Authentication failed" });
        } catch (error) {
            next(error);
        }
    }
   async logoutAdmin(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        res.clearCookie("adminRefreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

            res.status(200).json({ message: 'Logged out successfully' });
            return
        
    } catch (error) {
        next(error)
        console.log(error);
          res.status(500).json({ message: 'Internal Server Error' });
          return
    }
   }

   async getUsers(req:Request,res:Response,next:NextFunction)
   {
     try {

        let users=await this.adminUsecase.findAllUsers()

         
        if(!users) {
            return res.status(404).json({message:"Couldn't fetch users"})
         }
         

        return res.status(200).json(users)
        
     } catch (error) {
        next(error)
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
     }
   }
   async blockUser(req:Request,res:Response,next:NextFunction)
   {
      try {
            const {userId}=req.body
            let user=await this.adminUsecase.block(userId)
            if(!user)
            {
                return res.status(404).json({message:"couldn't find the user"})
            }
            return res.status(200).json(user)
        
      } catch (error) {
        next(error)
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
   async unBlockUser(req:Request,res:Response,next:NextFunction)
   {
      try {
            const {userId}=req.body
            let user=await this.adminUsecase.unBlock(userId)
            if(!user)
            {
                return res.status(404).json({message:"couldn't find the user"})
            }
            return res.status(200).json(user)
        
      } catch (error) {
        next(error)
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
   async adminRefreshToken(req:Request,res:Response,next:NextFunction){
    try {

        const refreshToken=req.cookies?.adminRefreshToken
        
    
        if(!refreshToken)
        {
            return res.status(403).json({message:"Refresh token is required"})
        }
        
        const newAccesstoken=await this.adminUsecase.makeAdminrefreshToken(refreshToken)

        if (!newAccesstoken) {
            return res.status(403).json({ message: "Invalid or expired refresh token" });
        }

        return res.status(200).json({message:"New access token created!",accessToken:newAccesstoken})

    } catch (error) {
        next(error)
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
   }
   
}