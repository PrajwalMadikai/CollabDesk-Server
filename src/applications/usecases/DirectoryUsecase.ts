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

    async updateFoldername(folderId:string,newName:string){
        try {

            let updatedFolder=await this.directoryRepository.updateName(folderId,newName)
            if(!updatedFolder)
            {
                return null
            }

            return updatedFolder
            
        } catch (error) {
            console.log("error in create directory",error);
            return { status: 500, message: 'An error occurred during updating directory.' }; 
        }
    }
    async fetchFolders(workspaceId:string)
    {
        try {
              let result=await this.directoryRepository.fetchFolders(workspaceId)
              if(!result)
              {
                   return null
              }
              return result
            
        } catch (error) {
            console.log("error in fetching directory",error);
            return { status: 500, message: 'An error occurred during fetchin directory.' }; 
        }
    }
     
    async fetchTrash(workspaceId:string)
    {
        try {

            const data=await this.directoryRepository.fetchTrashItems(workspaceId)
            if(!data) return null

            return data
            
        } catch (error) {
            console.log("error in fetching trash items",error);
            return { status: 500, message: 'An error occurred during fetching trash items.' }; 
        }
    }
    async moveToTrash(folderId:string,workspaceId:string)
    {
        try {

            const data=await this.directoryRepository.moveFoldertoTrash(folderId,workspaceId)
            if(!data) return null

            return data
            
        } catch (error) {
            console.log("error in moving folder to trash",error);
            return { status: 500, message: 'An error occurred during moving folder to trash.' }; 
        }
    }

    async restoreFolder(folderId:string)
    {
        try {

            const data=await this.directoryRepository.restoreFolder(folderId)
            
            if(!data) return null

            return data
            
        } catch (error) {
            console.log("error in restoring folder from trash",error);
            return { status: 500, message: 'An error occurred during restoring folder from trash.' }; 
        }
    }
}