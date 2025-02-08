import { NextFunction, Request, Response } from 'express';
import { DirectoryUsecase } from "../../applications/usecases/DirectoryUsecase";

export class DirectoryController{
    constructor(
        private directoryUsecase:DirectoryUsecase
    ){}

    async createFolder(req:Request,res:Response,next:NextFunction):Promise<void>
    {
        try {
             const {name,workspaceId}=req.body

             if (!name || !workspaceId) {
                 res.status(400).json({ error: "Folder name and workspace ID are required" });
                 return
              }

             const result=await this.directoryUsecase.createFolder(name,workspaceId)
             console.log('result:',result)
             if(!result)
             {
                 res.status(404).json({message:"Unable to find workspace for creating Folder!"})
                 return
             }
              res.status(200).json({message:"Folder created successfully",result})
             return
        } catch (error) {
            next(error)
             res.status(500).json({message:"Internal server error"})
            return
        }
    }

    async updateFolder(req:Request,res:Response,next:NextFunction):Promise<void>
    {
        try{
            const { folderId } = req.params;
            const {newName}=req.body

            console.log(newName);
            console.log(folderId);
            

        if (!newName) {
            res.status(400).json({ message: "Folder name is required" });
            return;
          }

        let folder=await this.directoryUsecase.updateFoldername(folderId,newName)

        if(!folder)
        {
             res.status(404).json({message:"Unable to find the folder"})
             return
        }

        res.status(200).json({message:"Folder updated successfully",folder})
        return
        }
        catch(error)
        {
            next(error)
            res.status(500).json({message:"Internal server error"})
           return
        }
    }

    async fetchFolder(req:Request,res:Response,next:NextFunction)
    {
        try {
            const {workspaceId}=req.body

            if(!workspaceId)
            {
                 res.status(404).json({message:"workspace id is missing"})
                 return
            }

            let folders=await this.directoryUsecase.fetchFolders(workspaceId)

            if(!folders)
            {
                res.status(404).json({message:"Unable to fetch directories"})
                return
            }

            res.status(202).json({message:"Folder fetched successfully",folders})
            return
            
        } catch (error) {
            next(error)
            res.status(500).json({message:"Internal server error"})
            return
        }
    }

}