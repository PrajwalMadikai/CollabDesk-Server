import { DirectoryEntity } from "../entities/directoryEntity";
import { TrashItems } from "../interface/trashItems";

export interface DirectoryInterface{
    
    createFolder(name:string,workspaceId:string):Promise<DirectoryEntity|null>

    updateName(folderId:string,newName:string):Promise<DirectoryEntity|null>

    fetchFolders(workspaceId:string):Promise<DirectoryEntity[]|null>
    
    deleteFolder(folderId:string):Promise<DirectoryEntity|null>

    fetchTrashItems(workspaceId:string):Promise<TrashItems>
}