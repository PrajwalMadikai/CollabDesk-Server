import { DirectoryEntity } from "../entities/directoryEntity";

export interface DirectoryInterface{
    
    createFolder(name:string,workspaceId:string):Promise<DirectoryEntity|null>

    updateName(folderId:string,newName:string):Promise<DirectoryEntity|null>
}