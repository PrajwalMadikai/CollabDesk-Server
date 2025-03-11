import { NextFunction, Request, Response } from "express";
import { FileUsecase } from "../../applications/usecases/FileUsecase";

export class FileController{
    constructor(
        private fileUsecase:FileUsecase
    ){}
    async createFiles(req:Request,res:Response,next:NextFunction)
    {
        try {

            const {folderId,email}=req.body
            if (!folderId) {
                return res.status(400).json({ message: "Folder id is missing!" });
            }
            let file=await this.fileUsecase.createFile(folderId,email)
            
            if(!file)
            {
                return res.status(404).json({message:"Unable to create file"})
            }
            
            return res.status(201).json({message:"File created successfully",file})
            
        } catch (error) {
            next(error)
        }
    }
    async movetoTrash(req:Request,res:Response,next:NextFunction)
    {
        try {
              const {fileId,folderId} = req.body
              if(!folderId||!fileId)
              {
                return res.status(400).json({message:"Folder id is missing"})
              }
              let result=await this.fileUsecase.movetoTrash(fileId,folderId)

              if(!result)
              {
                return res.status(400).json({message:"Unable to delete the file"})
              }

              return res.status(200).json({message:"File deleted successfully"})

            
        } catch (error) {
           return next(error)
        }
    }

    async contentFetch(req:Request,res:Response,next:NextFunction)
    {
        try {
            const {fileId}=req.params
          
            if(!fileId)
            {
                return res.status(400).json({message:"FileId is missing"})
            }

            let file=await this.fileUsecase.fetchContent(fileId)
            if(!file)
            {
                return res.status(404).json({message:'Unable to find the file'})
            }

            return res.status(200).json({message:"File content fetched successfully",file})
            
        } catch (error) {
            next(error)
        }
    }
    async fetchFile(req:Request,res:Response,next:NextFunction)
    {
        try {

            const {folderId}=req.body
             
            if(!folderId)
            {
                return res.status(400).json({message:"Missing folder id"})
            }
            const file=await this.fileUsecase.fetchFile(folderId)
            if(!file)
            {
                return res.status(404).json({message:"Unable to find files"})
            }
            return res.status(200).json({message:"Files fetched successfully",file})
            
        } catch (error) {
            next(error)
        }
    }
    async updateFileName(req:Request,res:Response,next:NextFunction)
    {
        try {

            const {fileId}=req.params
            const {name,folderId,email}=req.body
            if(!folderId)
            {
                return res.status(400).json({message:"Missing folder id"})
            }
            const file=await this.fileUsecase.updateFileName(fileId,folderId,name,email)
            if(!file)
            {
                return res.status(404).json({message:"Unable to update files"})
            }
            return res.status(200).json({message:'file is updated',file})
        } catch (error) {
            next(error)
        }
    }

    async uploadImage(req:Request,res:Response,next:NextFunction)
    {
        try {

            const {fileId}=req.params
            const image = req.file;
          
            if(!fileId||!image)
            {
                return res.status(400).json({message:"Missing file id or image"})
            }

            const file=await this.fileUsecase.uploadImage(fileId,image.buffer)
            if(!file)
            {
                return res.status(404).json({message:"Unable to update files"})
            }
            res.status(200).json({
                message: "Cover image uploaded successfully",
                file,
              });
        } catch (error) {
            next(error)
        }
    }
    async fileRestore(req:Request,res:Response,next:NextFunction)
    {
        try {
            const {fileId,email}=req.body
            if(!fileId)
            {
                return res.status(400).json({message:"file id missing"})
            }
            const data=await this.fileUsecase.restoreFile(fileId,email)
            if(!data)
            {
                return res.status(404).json({message:"Unable to restore the file from trash"})
            }
            
            return res.status(200).json({message:"File restored from trash",data})
            
        } catch (error) {
            next(error)
        }
    }
    async makeDocOnline(req:Request,res:Response,next:NextFunction)
    {
        try {
            const {fileId}=req.params
            if(!fileId)
            {
                return res.status(400).json({message:"file id missing"})
            }
            const data = await this.fileUsecase.publishDoc(fileId)
            if(!data)
            {
                return res.status(404).json({message:"Unable publish document"})
            }

            return res.status(200).json({message:"published document online",data})
            
        } catch (error) {
            next(error)
        }
    }
   async getFileReview(req:Request,res:Response,next:NextFunction)
   {
      try {

        const {fileId}=req.params
        if(!fileId)
        {
            return res.status(400).json({message:"file id missing"})
        }
        const file=await this.fileUsecase.fetchPreview(fileId)
        if(!file)
        {
            return res.status(404).json({message:"Unable fetch preview data"})
        }
    
        return res.status(200).json({message:"preview fetched successfully",file})
      } catch (error) {
        next(error)
      }
   }
}