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
             if(!result)
             {
                 res.status(404).json({message:"Unable to find workspace for creating Folder!"})
                 return
             }
              res.status(200).json({message:"Folder created successfully",folder:result})
             return
        } catch (error) {
            next(error)
        }
    }

    async updateFolder(req:Request,res:Response,next:NextFunction):Promise<void>
    {
        try{
            const { folderId } = req.params;
            const {name}=req.body;


        if (!name) {
            res.status(400).json({ message: "Folder name is required" });
            return;
          }

        let folder=await this.directoryUsecase.updateFoldername(folderId,name)

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
        }
    }

    async fetchFolder(req: Request, res: Response, next: NextFunction) {
        try {
            const { workspaceId } = req.body;
    
            if (!workspaceId) {
                res.status(400).json({ message: "workspace id is missing" });
                return;
            }
    
            let folders = await this.directoryUsecase.fetchFolders(workspaceId);
    
            if (!folders) {
                res.status(404).json({ message: "Unable to fetch directories" });
                return;
            }
    
            res.status(200).json({ message: "Folders fetched successfully", folders });
            return;
    
        } catch (error) {
            next(error);
        }
    }
    async folderDelete(req:Request,res:Response,next:NextFunction)
    {
        try {
               const {folderId}=req.params
               if(!folderId)
               {
                 res.status(400).json({message:"Folder id is missing"})
                 return
               }
               let result=await this.directoryUsecase.deleteFolder(folderId)

               if(!result)
               {
                res.status(404).json({message:"Unable to delete folder"})
                return
               }

               res.status(200).json({message:"folder deleted successfully"})
               return
        } catch (error) {
            next(error)
        }
    }
    async fetchTrashItems(req:Request,res:Response,next:NextFunction)
    {
        try {
            const {workspaceId}=req.body
            if(!workspaceId)
            {
                res.status(400).json({message:"workspace id is missing"})
                return
            }
            const result=await this.directoryUsecase.fetchTrash(workspaceId)
            if(!result)
            {
                res.status(404).json({message:"Unable to fetch trash items"})
                return
            }
            res.status(200).json({message:"trash items fetched successfully",result})
            return
        } catch (error) {
            next(error)
        }
    }
}