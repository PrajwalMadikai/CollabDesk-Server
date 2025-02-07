import { NextFunction, Request, Response } from "express";
import { WorkspaceUsecase } from "../../applications/usecases/WorkspaceUsecase";

export class WorkspaceController{
    constructor(
        private workspaceUsecase:WorkspaceUsecase
    ){}
    async newWorkspace(req:Request,res:Response,next:NextFunction)
    {
         try {
               const{spaceName,userId}=req.body
               
               const space=await this.workspaceUsecase.createSpace(spaceName,userId)

               if (!space) {
                return res.status(409).json({ message: "Workspace name already exists" });
               }
   
               res.status(201).json(space);

         } catch (error:any) {
            next(error)
            console.log(error.message);
            return res.status(500).json({ message: error.message });
         }
    }
    async getUserWorkspace(req:Request,res:Response,next:NextFunction)
    {
        try {
            const {userId}=req.body
           
            
            let result=await this.workspaceUsecase.fetchWorkspace(userId)
            console.log('user id:',result);
            if(!result)
            {
                return res.status(404).json({message:"couldn't find user"})
            }
            return res.status(200).json({message:'user workspace fetched',workspace:result})
            
        } catch (error:any) {
            next(error)
            return res.status(500).json({ message: error.message });
        }
    }
}