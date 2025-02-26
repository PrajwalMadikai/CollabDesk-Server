import { DirectoryEntity } from "../entities/directoryEntity";
import { TrashItems } from "../interface/trashItems";

export interface DirectoryInterface{
    
    createFolder(name:string,workspaceId:string,userId:string):Promise<DirectoryEntity|null>

    updateName(folderId:string,newName:string):Promise<DirectoryEntity|null>

    fetchFolders(workspaceId:string):Promise<DirectoryEntity[]|null>
    
    fetchTrashItems(workspaceId:string):Promise<TrashItems>

    moveFoldertoTrash(folderId:string,workspaceId:string):Promise<DirectoryEntity|null>

    restoreFolder(folderId:string):Promise<DirectoryEntity|null>
}