import { DirectoryRepository } from "../../respository/DirectoryRepository";

export class DirectoryUsecase{
    constructor(
        private directoryRepository:DirectoryRepository
    ){}

    async createFolder(name:string,workspaceId:string)
    {
        try {

               let result=await this.directoryRepository.createFolder(name,workspaceId)
               if(!result)
               {
                return null
               }
               return result
            
        } catch (error) {
            console.log("error in create directory",error);
            return { status: 500, message: 'An error occurred during creating directory.' }; 
        }
    }
}