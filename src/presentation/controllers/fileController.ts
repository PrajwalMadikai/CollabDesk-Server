import { NextFunction, Request, Response } from "express";
import { FileUsecase } from "../../applications/usecases/FileUsecase";

export class FileController{
    constructor(
        private fileUsecase:FileUsecase
    ){}
    async createFiles(req:Request,res:Response,next:NextFunction)
    {
        try {

            const {folderId}=req.body
            if (!folderId) {
                return res.status(400).json({ message: "Folder id is missing!" });
            }
            let file=await this.fileUsecase.createFile(folderId)
            
            if(!file)
            {
                return res.status(404).json({message:"Unable to create file"})
            }
            
            return res.status(201).json({message:"File created successfully",file})
            
        } catch (error) {
            next(error)
        }
    }
    async deleteFile(req:Request,res:Response,next:NextFunction)
    {
        try {
              const {fileId}=req.params
              const {folderId} = req.body
              if(!folderId)
              {
                return res.status(400).json({message:"Folder id is missing"})
              }
              let result=await this.fileUsecase.deleteFile(fileId,folderId)

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
            const {name,folderId}=req.body
            if(!folderId)
            {
                return res.status(400).json({message:"Missing folder id"})
            }
            const file=await this.fileUsecase.updateFileName(fileId,folderId,name)
            if(!file)
            {
                return res.status(404).json({message:"Unable to update files"})
            }
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
}