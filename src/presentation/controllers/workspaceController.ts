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
               console.log('controller:',spaceName);
               
               const space=await this.workspaceUsecase.createSpace(spaceName,userId)

               if (!space) {
                return res.status(404).json({ message: "Workspace name already exists" });
               }
   
               res.status(201).json(space);

         } catch (error:any) {
        
            console.log(error.message);
            res.status(500).json({ message: error.message });
         }
    }
}