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
   
               res.status(201).json({workspace:space});

         } catch (error:any) {
            next(error)
            console.log(error.message);
         }
    }
    async getUserWorkspace(req:Request,res:Response,next:NextFunction)
    {
        try {
            const {userId}=req.body
           
            
            let result=await this.workspaceUsecase.fetchWorkspace(userId)
            if(!result)
            {
                return res.status(404).json({message:"couldn't find user"})
            }
            return res.status(200).json({message:'user workspace fetched',workspace:result})
            
        } catch (error:any) {
            next(error)
        }
    }

    async addCollaborator(req:Request,res:Response,next:NextFunction)
    {
        try {

            const {email,workspaceId}=req.body
            
            if(!email||!workspaceId)
            {
                return res.status(400).json({message:"User email is missing"})
            }
            const result=await this.workspaceUsecase.addUsertoWorkspace(email,workspaceId)
            if(!result)
            {
                 return res.status(404).json({message:"Unable to add collaborators"})
            }

            return res.status(200).json({message:"collaborator added successfully",user:result})
            
        } catch (error) {
            next(error)
        }
    }
    async fetchCollaborator(req:Request,res:Response,next:NextFunction)
    {
        try {

            const {workspaceId}=req.body
            if(!workspaceId)
            {
                return res.status(400).json({message:"workspace id is missing"})
            }
            const space=await this.workspaceUsecase.findCollaborators(workspaceId)
            if(!space)
            {
                return res.status(404).json({message:"Unable to find collaborators"})
            }
            return res.status(200).json({message:"collaborators fetched successfully",user:space})
        } catch (error) {
            next(error)
        }
    }
}