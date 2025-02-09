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
}