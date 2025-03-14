import { FileRepository } from "../../respository/fileRepository";
import { CloudinaryAdapter } from "../services/CloudinaryService";

export class FileUsecase{
    constructor(
        private fileRepository:FileRepository,
        private cloudinaryService:CloudinaryAdapter
    ){}

    async createFile(folderId:string,email:string){
        try {

            let result=await this.fileRepository.createFile(folderId,email)
            if(!result) return null 

            return result

        } catch (error) {
            console.log("error in file creation",error);
            return { status: 500, message: 'An error occurred during file creation.' }; 
        }
    }

    async movetoTrash(fileId:string,folderId:string)
    {
        try {
              const result=await this.fileRepository.movetoTrash(fileId,folderId)
              if(!result)
              {
                  return null
              }

              return result

        } catch (error) {
            console.log("error in file deletion",error);
            return { status: 500, message: 'An error occurred during file deletion.' }; 
        }
    }

    async fetchContent(fileId:string)
    {
        try {

            let result=await this.fileRepository.fetchFileContent(fileId)
            if(!result)
            {
                 return null
            }
           
            return result
            
        } catch (error) {
            console.log("error in file content fetching",error);
            return { status: 500, message: 'An error occurred during file content fetching.' }; 
        }
    }

    async fetchFile(folderId:string)
    {
        try {

            let result=await this.fileRepository.fetchFile(folderId)
            if(!result) return null
         
            return result.files
            
        } catch (error) {
            console.log("error in file content fetching",error);
            return { status: 500, message: 'An error occurred during file content fetching.' }; 
        }
    }
    async updateFileName(fileId:string,folderId:string,name:string,email:string)
    {
        try {
            const result=await this.fileRepository.updateFileName(fileId,folderId,name,email)
            if(!result) return null

            return result
            
        } catch (error) {
            console.log("error in file content fetching",error);
            return { status: 500, message: 'An error occurred during file content fetching.' }; 
        }
    }
    async uploadImage(fileId:string,image:Buffer)
    {
        try {

            const imageUrl=await this.cloudinaryService.upload(image)
            const file=await this.fileRepository.uploadImage(fileId,imageUrl)
            if(!file) return null;
          
            return file
            
        } catch (error) {
            console.log("error in image uploading",error);
            return { status: 500, message: 'An error occurred during image uploading.' }; 
        }
    }
    async restoreFile(fileId:string,email:string)
    {
        try {

            const data=await this.fileRepository.restoreFile(fileId,email)
            if(!data) return null

            return data
            
        } catch (error) {
            console.log("error in file restoring",error);
            return { status: 500, message: 'An error occurred during file restoring.' }; 
        }
    }
    async publishDoc(fileId:string){
        try {
             
            const data = await this.fileRepository.makePublish(fileId)
            if(!data) return null

            return data

        } catch (error) {
            console.log("error in file restoring",error);
            return { status: 500, message: 'An error occurred during file restoring.' }; 
        }
    }

    async fetchPreview(fileId:string){
        try {
            const data = await this.fileRepository.fetchPreview(fileId)
            if(!data) return null

            return data
            
        } catch (error) {
            console.log("error in file restoring",error);
            return { status: 500, message: 'An error occurred during file restoring.' }; 
        }
    }
}