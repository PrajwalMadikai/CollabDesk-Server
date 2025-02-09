import { NextFunction, Request, Response } from "express";
import { FileUsecase } from "../../applications/usecases/FileUsecase";

export class FileController{
    constructor(
        private fileUsecase:FileUsecase
    ){}
    async createFiles(req:Request,res:Response,next:NextFunction)
    {
        try {

            const {folderId,name}=req.body
            if (!folderId||!name) {
                return res.status(400).json({ message: "Folder id or File name is missing!" });
            }
            let file=await this.fileUsecase.createFile(folderId,name)
            
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