import { FileRepository } from "../../respository/fileRepository";

export class FileUsecase{
    constructor(
        private fileRepository:FileRepository
    ){}

    async createFile(folderId:string){
        try {

            let result=await this.fileRepository.createFile(folderId)
            if(!result) return null 

            return result

        } catch (error) {
            console.log("error in file creation",error);
            return { status: 500, message: 'An error occurred during file creation.' }; 
        }
    }

    async deleteFile(fileId:string,folderId:string)
    {
        try {
              const result=await this.fileRepository.deleteFile(fileId,folderId)
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
           console.log('file content:',result);
           
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
 
}