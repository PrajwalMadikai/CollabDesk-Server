import { NextFunction, Request, Response } from 'express';
import { DirectoryUsecase } from "../../applications/usecases/DirectoryUsecase";

export class DirectoryController{
    constructor(
        private directoryUsecase:DirectoryUsecase
    ){}

    async createFolder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, workspaceId, userId } = req.body;
    
            if (!name || !workspaceId || !userId) {
                res.status(400).json({ error: "Folder name, workspace ID, and user ID are required" });
                return;
            }
    
            const result = await this.directoryUsecase.createFolder(name, workspaceId, userId);
    
            if (!result) {
                res.status(404).json({ message: "Unable to find workspace for creating folder!" });
                return;
            }
    
            res.status(201).json({ message: "Folder created successfully", folder: result });
        } catch (error: any) {
            if (error.message.includes("Folder limit exceeded")) {
                res.status(403).json({
                    message: "Folder limit exceeded for your subscription plan. Upgrade to create more folders."
                });
            } else {
                next(error);  
            }
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

    async movetoTrash(req:Request,res:Response,next:NextFunction)
    {
        try {

            const {folderId,workspaceId}=req.body
            if(!folderId)
            {
                res.status(400).json({message:"folder id is missing"})
                return
            }
            const data=await this.directoryUsecase.moveToTrash(folderId,workspaceId)
            if(!data)
            {
                res.status(404).json({message:"Unable to move folder to trash"})
                return
            }
            res.status(200).json({message:"folder moved to trash successfully"})
            return
            
        } catch (error) {
            next(error)
        }
    }

    async restoreFolder(req:Request,res:Response,next:NextFunction)
    {
        try {

            const {folderId}=req.body
            if(!folderId)
            {
                res.status(400).json({message:"folder id is missing"})
                return
            }
            const data=await this.directoryUsecase.restoreFolder(folderId)
            if(!data){
                res.status(404).json({message:"Unable to restore the folder"})
                return
            }
            res.status(200).json({message:"folder successfully",data})
            return
        } catch (error) {
            next(error)
        }
    }
}