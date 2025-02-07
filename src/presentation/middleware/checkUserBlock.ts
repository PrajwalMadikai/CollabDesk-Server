import { NextFunction, Response } from 'express';
import { UserModal } from '../../database/models/userModal';
import { AuthenticatedRequest } from './authMiddleware';

export const checkUserBlockStatus=async(req:AuthenticatedRequest,res:Response,next:NextFunction):Promise<void>=>{
  try {
    const userId = req.user?.userId;  
    

    if (!userId) {
       res.status(401).json({ message: "User ID not found, authentication failed" });
       return
    }

    const user = await UserModal.findById({_id:userId});

    if (!user) {
         res.status(404).json({ message: "User not found" });
        return
      }

    if (user.isBlock) {
     res.status(403).json({ message: "Your account is blocked" });
     return
    }
    
    next();

  } catch (error) {
    console.error("Error checking block status:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}